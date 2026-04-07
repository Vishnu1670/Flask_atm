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

//change pin
document.addEventListener("DOMContentLoaded", function() {

    document.getElementById("changePinBtn").addEventListener("click", function() {

        let acc_no = document.getElementById("acc_no").value;
        let oldPinInput = document.getElementById("old_pin");
        let newPinInput = document.getElementById("new_pin");
        let confirmPinInput = document.getElementById("conform_pin");

        let old_pin = oldPinInput.value;
        let new_pin = newPinInput.value;
        let conform_pin = confirmPinInput.value;

        // ✅ validation
        if (!old_pin || !new_pin || !conform_pin) {
            alert("All fields are required");
            return;
        }

        if (new_pin == old_pin){
            alert("New pin can't be same as old pin");
            return;
        }

        if (new_pin.length !== 4 || isNaN(new_pin)) {
            alert("New PIN must be 4 digits");
            return;
        }

        if (new_pin !== conform_pin) {
            alert("New PIN and Confirm PIN must match");
            return;
        }

        let formData = new FormData();
        formData.append("acc_no", acc_no);
        formData.append("old_pin", old_pin);
        formData.append("new_pin", new_pin);
        formData.append("conform_pin", conform_pin);

        fetch("/home/change_pin", {
            method: "POST",
            body: formData
        })
        .then(res => res.json())
        .then(data => {

            alert(data.message || data.error);

            // ✅ clear inputs on success
            if (data.message) {
                oldPinInput.value = "";
                newPinInput.value = "";
                confirmPinInput.value = "";
            }

        });

    });

});

//transfer
document.addEventListener("DOMContentLoaded", function(){

    let transferBtn = document.getElementById("transfer");

    if(transferBtn){

        transferBtn.addEventListener("click", function(){

            let to_acc = document.getElementById("to_acc").value;
            let amount = document.getElementById("amount").value;

            // acc_no comes from Jinja
            let from_acc = document.getElementById("from_acc").value;

            if(!to_acc || !amount){
                alert("Please fill all fields");
                return;
            }

            let formData = new FormData();
            formData.append("from_acc", from_acc);
            formData.append("to_acc", to_acc);
            formData.append("amount", amount);

            fetch("/home/transfer", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {

                if(data.error){
                    alert(data.error);
                } else {
                    alert(data.message);

                    // redirect back to dashboard after success
                    window.location.href = `/home/dashboard/${from_acc}`;
                }

            })
            .catch(err => {
                console.log(err);
                alert("Transfer failed");
            });

        });

    }

});

document.addEventListener("DOMContentLoaded", function(){

    let accInput = document.getElementById("acc_no");

    if(!accInput){
        console.log("acc_no not found");
        return;
    }

    let acc_no = accInput.value;

    window.loadTransactions = function(){

        fetch(`/home/transactions/${acc_no}`)
        .then(res => {

            if(!res.ok){
                throw new Error("Failed to fetch");
            }

            return res.json();
        })
        .then(data => {

            let listDiv = document.getElementById("list");
            listDiv.innerHTML = "";

            if(data.length === 0){
                listDiv.innerHTML = "<p>No transactions found</p>";
                return;
            }

            data.forEach(txn => {

                let item = document.createElement("div");
                item.style.border = "1px solid #ccc";
                item.style.padding = "8px";
                item.style.margin = "5px";

                item.innerHTML = `
                    <strong>${txn.message}</strong><br>
                    <small>${txn.date}</small>
                `;

                listDiv.appendChild(item);

            });

        })
        .catch(err => {
            console.log(err);
            alert("Error loading transactions");
        });

    }

});

//delete
document.addEventListener("DOMContentLoaded", function(){

    let deleteBtn = document.getElementById("delete_btn");

    if(deleteBtn){

        let acc_no = deleteBtn.getAttribute("data-acc");

        deleteBtn.addEventListener("click", function(){

            let confirmDelete = confirm("Are you sure you want to delete your account?");

            if(confirmDelete){

                fetch(`/home/delete/${acc_no}`, {
                    method: "DELETE"
                })
                .then(res => res.json())
                .then(data => {

                    if(data.error){
                        alert(data.error);
                    } else {
                        alert(data.message);

                        // redirect after delete
                        window.location.href = "/home";
                    }

                })
                .catch(err => {
                    console.log(err);
                    alert("Error deleting account");
                });

            }

        });

    }

});
