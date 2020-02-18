const router = require("express").Router();

const User = require("./schema").User;
const Subscription = require("./schema").Subscription;

let stripe = require('stripe')('sk_test_gY7JgcoVgEahKXOTdd4UQTy3007XKkxyXI');

router.get("/", (req, res) => {
  res.sendFile(__dirname + "/pages/login.html");
});

router.post("/register", async (req, res) => {
  let user = new User({
    email: req.body.email,
    phone: req.body.mobile,
    name: req.body.name,
    cid: '',
    pmid: '',
    password: req.body.password,
    credit: 0
  });
  await user.save().then(() => {
    res.send("done");
  });
});

router.post("/login", async (req, res) => {
  let user = await User.find({
    email: req.body.email,
    password: req.body.password
  });
  if (user.length)
    res.send(user[0]._id);
  else res.send("false");
})





// router.post("/create-customer", async (req, res) => {
//   let id = req.body.id;
//   let user = await User.find({
//     _id: id,
//   });

//   const customer = await stripe.customers.create({
//     payment_method: req.body.payment_method,
//     email: user[0].email,
//     name: user[0].name,
//     invoice_settings: {
//       default_payment_method: req.body.payment_method,
//     },
//   });

//   let plan = req.body.plan;

//   await stripe.subscriptions.create({
//     customer: customer.id,
//     items: [{ plan: plan.planId }],
//     expand: ["latest_invoice.payment_intent"]
//   }, async (err, subscription) => {
//     if (err) {
//       res.send(err);
//     }
//     else {
//       let sub = new Subscription({
//         id: id,
//         status: 'Active',
//         planId: plan.planId,
//         planName: plan.planName
//       });

//       await sub.save();

//       await User.updateOne(
//         {
//           _id: id
//         },
//         {
//           $set: {
//             cid: customer.id,
//             pmid: req.body.payment_method,
//             credit: subscription.plan.metadata.credit
//           }
//         });

//       res.send("ok");
//     }

//   });


// });

router.post('/get-customer', async (req, res) => {
  console.log(req.body)
  let id = req.body.id;
  let customer = await User.find({ _id: id });
  res.send(customer);
});

router.post("/create-customer", async (req, res) => {


  let user = await User.find({ _id: req.body.id });

  await stripe.paymentMethods.create({
    type: 'card',
    card: {
      number: req.body.card.number,
      exp_month: req.body.card.exp_month,
      exp_year: req.body.card.exp_year,
      cvc: req.body.card.cvc
    }
  }, async (err, payment_method) => {

    if (err) res.send(err.raw)
    else {
      const customer = await stripe.customers.create({
        payment_method: payment_method.id,
        email: user[0].email,
        name: user[0].name,
        invoice_settings: {
          default_payment_method: payment_method.id,
        },
      });


      let plan = req.body.plan;

      await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ plan: plan.planId }],
        expand: ["latest_invoice.payment_intent"]
      }, async (err, subscription) => {
        console.log(subscription);
        if (err) {
          res.send(err);
        }
        else {
          let sub = new Subscription({
            id: req.body.id,
            status: 'Active',
            planId: plan.planId,
            planName: plan.planName
          });

          await sub.save();

          await User.updateOne(
            {
              _id: req.body.id
            },
            {
              $set: {
                cid: customer.id,
                pmid: subscription.latest_invoice.payment_intent.payment_method,
                credit: subscription.plan.metadata.credit
              }
            });

          res.send("ok");
        }

      });

    }
  })

});


router.post('/get-sub', async (req, res) => {
  let id = JSON.parse(req.body.id);
  Subscription.find({ id }).then((data) => {
    if (data.length) {
      let d = {};
      d.status = data[0].status;
      d.planId = data[0].planId;
      d.planName = data[0].planName;
      res.send(JSON.stringify(d));
    }
    else res.send("no");
  })
});

router.post('/change-plan', async (req, res) => {
  let id = req.body.id;
  let planId = req.body.planId;
  let user = await User.find({
    _id: id,
  });

  let cid = user[0].cid;

  const customer = await stripe.customers.retrieve(cid)
  const sub_id = customer.subscriptions.data[0].id
  const sub_Item_id = customer.subscriptions.data[0].items.data[0].id;

  const response = await stripe.subscriptions.update(
    sub_id,
    {
      cancel_at_period_end: false,
      items: [
        {
          id: sub_Item_id,
          plan: planId
        }
      ]
    });

  await Subscription.updateOne(
    {
      id: id
    },
    {
      $set: {
        planId: response.plan.id,
        planName: response.plan.nickname
      }
    }
  );

  await User.updateOne(
    {
      _id: id
    },
    {
      $set: {
        credit: response.items.data[0].plan.metadata.credit
      }
    }
  );

  res.send(response);

  //res.send("working");
});



router.post("/webhooks", async (req, res) => {
  console.log(req);
  try {
    let action = req.body;
    if (action.type === "invoice.payment_succeeded") {
      const customer = await stripe.customers.retrieve(
        action.data.object.customer
      );
      const activePlan = customer.subscriptions.data[0].items.data[0].plan;
      const credits = activePlan.nickname === "Plan 1" ? 10 : 20;
      await User.updateOne(
        { cid: action.data.object.customer },
        { credit: credits },
        err => {
          if (err) {
            console.warn(err);
            res.send({ message: "Failed", credits: credits });
          } else
            res.send({
              message: "Credits Renewed",
              credits: credits
            });
        }
      );
    }
    else res.send(action);

  } catch (err) {
    res.send("Webhook err: " + err.message);
  }
}
);




module.exports = router;
