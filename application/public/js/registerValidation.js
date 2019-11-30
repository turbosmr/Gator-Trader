$(document).ready(function () {
    // Execute the following only if on register
    if (window.location.pathname == '/user/register') {
        $("#password").keyup(function () {
            // Check if password field is less than 8 characters
            if ($("#password").val().length < 8) {
                // Alert user
                $("#password").css("border", "1px solid red");
                $("#passwordMsg").html("Password must be atleast 8 characters").css("color", "red");
            }
            else {
                $("#password").css("border", "");
                $("#passwordMsg").empty();
            }
        });
        $("#confirmPassword").keyup(function () {
            // Check if password and confirm password fields match
            if ($("#password").val() != $("#confirmPassword").val()) {
                // Alert user
                $("#confirmPassword").css("border", "1px solid red");
                $("#confirmPasswordMsg").html("Passwords do not match").css("color", "red");
            }
            else {
                $("#confirmPassword").css("border", "");
                $("#confirmPasswordMsg").empty();
            }
        });
    }
});