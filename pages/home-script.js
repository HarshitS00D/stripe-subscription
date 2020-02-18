fetchAccountDetails = async () => {
    if (!sessionStorage.getItem('id')) {
        window.location.href = "login.html";
    }

    let data = {
        id: sessionStorage.getItem('id'),
    }
    let xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/get-sub");
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send(JSON.stringify(data));
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            let res = xhttp.responseText;
            if (res === "no") {
                let plan = document.getElementById('d1');
                plan.setAttribute("style", "color: red");
                plan.innerHTML = "No Plan";
                let status = document.getElementById('d2');
                status.setAttribute("style", "color: red")
                status.innerHTML = "Inactive";

                let changePlanButton = document.getElementById("changePlanButton");
                changePlanButton.style.display = "none";

            }
            else {
                let plandiv = document.getElementById('plandiv');
                plandiv.style.display = "none";

                let plan = document.getElementById('d1');
                plan.setAttribute("style", "color: red");

                let planName = JSON.parse(res).planName;
                plan.innerHTML = planName;


                let status = document.getElementById('d2');
                status.setAttribute("style", "color: red")
                status.innerHTML = JSON.parse(res).status;

                let changePlanButton = document.getElementById("changePlanButton");
                changePlanButton.style.display = "block";


            }
        }
    }


    const response = await axios.post('/get-customer', { id: JSON.parse(sessionStorage.getItem('id')) });
    let name = document.getElementById("name");
    name.innerHTML = response.data[0].name;
    let credit = document.getElementById("credit");
    credit.innerHTML = response.data[0].credit;

}
plan = val => {
    if (val === 1) {
        sessionStorage.setItem('plan', JSON.stringify({ 'planId': 'plan_Gij6zkKTOLakxg', 'planName': 'plan 1' }));
        window.location.href = "checkout.html";
    }
    else {
        sessionStorage.setItem('plan', JSON.stringify({ 'planId': 'plan_GijDjgynZLsrtN', 'planName': 'plan 2' }));
        window.location.href = "checkout.html";
    }
}
logout = () => {
    sessionStorage.removeItem('plan');
    sessionStorage.removeItem('id');
    window.location.href = "login.html";
}
changePlan = () => {
    window.location.href = "change-plan.html";
}