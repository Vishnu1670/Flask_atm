document.addEventListener("DOMContentLoaded", function() {

    let form = document.getElementById("login_form");

    if (form) {

        form.addEventListener("submit", function(e) {

            e.preventDefault();

            let formData = new FormData(form);

            fetch("/home/login", {
                method: "POST",
                body: formData
            })
            .then(res => res.json())
            .then(data => {

                // show message
                if (data.message) {
                    alert(data.message);

                    // ✅ redirect to dashboard
                    window.location.href = `/home/dashboard/${data.acc_no}`;
                } else {
                    alert(data.error);
                }

            })
            .catch(error => {
                console.log(error);
                alert("Login failed");
            });

        });

    }

});