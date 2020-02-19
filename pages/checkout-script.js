
// var stripe = Stripe('pk_test_Xkyg29ginOFgCuFKqkAVJZ2C00EHlgOR1z');
// var elements = stripe.elements();



// Set up Stripe.js and Elements to use in checkout form
var style = {
    base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
            color: "#aab7c4"
        }
    },
    invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
    }
};

// var cardElement = elements.create("card", { style: style });
// cardElement.mount("#card-element");


// cardElement.addEventListener('change', function (event) {
//     var displayError = document.getElementById('card-errors');
//     if (event.error) {
//         displayError.textContent = event.error.message;
//     } else {
//         displayError.textContent = '';
//     }
// });


var form = document.getElementById('subscription-form');

form.addEventListener('submit', async function (event) {
    // We don't want to let default form submission happen here,
    // which would refresh the page.
    event.preventDefault();
    let submitbtn = document.getElementById("submitbtn");
    submitbtn.className = "ui primary loading button";

    let obj = {
        id: JSON.parse(sessionStorage.getItem('id')),
        plan: JSON.parse(sessionStorage.getItem('plan')),
        card: {
            number: document.getElementById('cardNumber').value,
            exp_month: document.getElementById('month').value,
            exp_year: document.getElementById('cardExpiryYear').value,
            cvc: document.getElementById('CVC').value
        }
    }

    const result = await axios.post('/create-customer', obj)
    submitbtn.className = "ui blue button";

    if (result.data === "ok")
        window.location.href = "home.html";
    else alert(result.data.message);
})




cancel = () => {
    window.location.href = "home.html";
}