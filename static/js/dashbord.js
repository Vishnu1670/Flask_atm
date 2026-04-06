document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("depositBtn").addEventListener("click", function() {

        let formData = new FormData();

        let acc_no = document.getElementById("acc_no").value;
        let amountInput = document.getElementById("amount");
        let amount = amountInput.value;

        formData.append("acc_no", acc_no);
        formData.append("amount", amount);

        fetch("/home/deposit", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message || data.error);
            if (data.message) {
                amountInput.value = "";
            }
        });

    });

});

//Withdraw

document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("withdrawBtn").addEventListener("click", function() {

        let formData = new FormData();

        let acc_no = document.getElementById("acc_no").value;
        let amountInput = document.getElementById("amount");
        let amount = amountInput.value;

        if (!amount || amount <= 0) {
            alert("Enter a valid amount");
            return;
        }

        formData.append("acc_no", acc_no);
        formData.append("amount", amount);

        fetch("/home/withdraw", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            alert(data.message || data.error);
            if (data.message) {
                amountInput.value = "";
                amountInput.focus();
            }
        });

    });

});

//balance
document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("checkBalanceBtn").addEventListener("click", function() {

        let acc_no = document.getElementById("acc_no").value;
        let passwordInput = document.getElementById("password");
        let pin = passwordInput.value;

        if (!pin) {
            alert("Enter your PIN");
            return;
        }

        let formData = new FormData();
        formData.append("acc_no", acc_no);
        formData.append("pin", pin);

        fetch("/home/check_balance", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {

            if (data.balance !== undefined) {
                alert("Balance: ₹" + data.balance);

                // clear PIN after success
                passwordInput.value = "";
            } else {
                alert(data.error);
            }

        });

    });

});