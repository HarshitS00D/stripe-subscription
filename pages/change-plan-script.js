planDetail = () => {
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
            //console.log(res);
            let submitButton = document.getElementById(JSON.parse(res).planId + "btn");
            submitButton.disabled = true;
            submitButton.innerHTML = "Current Plan";
        }
    }
}

changePlan = async (planId) => {
    let submitbtn = document.getElementById(planId + "btn");
    submitbtn.className = "ui primary loading button";
    const res = await axios.post('/change-plan', { planId, id: JSON.parse(sessionStorage.getItem('id')) })
    submitbtn.className = "ui blue button";
    alert("Plan Changed");
    window.location.href = "home.html";

}

cancel = () => {
    window.location.href = "home.html";
}
