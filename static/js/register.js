document.addEventListener("DOMContentLoaded", function() {

    let form = document.querySelector("form");

    if (form) {

        form.addEventListener("submit", function(e) {

            e.preventDefault();

            let formData = new FormData(form);

            fetch("/home/register", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {

                // show alert message
                if (data.message) {
                    alert(data.message);

                    // ✅ redirect to login page after success
                    window.location.href = "/home/login";
                } else {
                    alert(data.error);
                }

            })
            .catch(error => {
                console.log(error);
                alert("Error registering account");
            });

        });

    }

});

let acc_no = window.location.pathname.split("/").pop();

// show sections
function showSection(id){
    document.querySelectorAll("div").forEach(d => d.style.display="none");
    document.getElementById(id).style.display="block";
}

// DEPOSIT

function deposit(){
    let amt = document.getElementById("deposit_amt").value;

    let formData = new FormData();
    formData.append("acc_no", acc_no);
    formData.append("amount", amt);

    fetch("/home/deposit", { method:"POST", body: formData })
    .then(res => res.json())
    .then(data => alert(data.message));
}

// WITHDRAW
function withdraw(){
    let amt = document.getElementById("withdraw_amt").value;

    let formData = new FormData();
    formData.append("acc_no", acc_no);
    formData.append("amount", amt);

    fetch("/home/withdraw", { method:"POST", body: formData })
    .then(res => res.json())
    .then(data => alert(data.message || data.error));
}

// BALANCE
function checkBalance(){
    fetch(`/home/balance/${acc_no}`)
    .then(res => res.json())
    .then(data => alert("Balance: ₹" + data.balance));
}

// CHANGE PIN
function changePin(){
    let formData = new FormData();
    formData.append("acc_no", acc_no);
    formData.append("old_pin", document.getElementById("old_pin").value);
    formData.append("new_pin", document.getElementById("new_pin").value);

    fetch("/home/change_pin", { method:"POST", body: formData })
    .then(res => res.json())
    .then(data => alert(data.message || data.error));
}

// TRANSFER
function transfer(){
    let formData = new FormData();
    formData.append("from_acc", acc_no);
    formData.append("to_acc", document.getElementById("to_acc").value);
    formData.append("amount", document.getElementById("transfer_amt").value);

    fetch("/home/transfer", { method:"POST", body: formData })
    .then(res => res.json())
    .then(data => alert(data.message || data.error));
}

// TRANSACTIONS
function loadTransactions(){
    fetch(`/home/transactions/${acc_no}`)
    .then(res => res.json())
    .then(data => {
        let output = document.getElementById("output");
        output.innerHTML = "";

        data.forEach(t => {
            output.innerHTML += `<p>${t.message} - ${t.date}</p>`;
        });
    });
}

// DELETE
function deleteAccount(){
    fetch(`/home/delete/${acc_no}`, { method:"DELETE" })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        window.location.href = "/home";
    });
}