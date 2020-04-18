var onCodeField = false;
var onPasswordField = false;

var callback = getParameterByName("callback");
var aidn = getParameterByName("aidn");
var appName = getParameterByName("appname");
var params = "appname="+appName+"&aidn="+aidn+"&callback="+callback;

var username;
var ksn;

window.onload = function() {
    $("#username").val("");
    $("#resetcode").val("");
    $("#password").val("");

    var usernamePrefill = getParameterByName("username_prefill");
    if (usernamePrefill) $("#username").val(usernamePrefill);
};

function executeContinue() {
    $("button").addClass("loading");
    resetErrors();
    turnOffSuccess("#resetcode");

    username = $("#username").val();

    if (username === "") {
        displayAlert("Please enter a username", "#username");
    }
    else {
        if (onPasswordField) {
            var new_password = $("#password").val();

            if (new_password === "") {
                displayAlert("Please enter a new password", "#password");
            }
            else {
                $.post("/api/accounts/resetpassword", {ksn, new_password}, function(data, status){
                    if (data.status === 202) {
                        $("#password-section").addClass("hidden");
                        $("#continue-btn").addClass("hidden");
                        $("hr").addClass("hidden");
                        $("#login-btn").removeClass("btn_outline");
                        $("h1").text("You're all set!");
                        $(".subtitle").text("You can now go back and login");
                        $("img").removeClass("hidden");
                    }
                    else if (data.status === 404) {
                        displayAlert("No account found", "#password");
                    }
                    else if (data.status === 500) {
                        displayAlert("Internal server error", "#password");
                    }
                });
            }
        }
        else if (onCodeField) {
            var reset_code = $("#resetcode").val();

            if (reset_code === "") {
                displayAlert("Reset code required", "#resetcode");
            }
            else {
                $.post("/api/accounts/resetcode/verify", {reset_code, username}, function(data, status){
                    if (data.status === 202) {
                        onPasswordField = true;
                        ksn = data.data.ksn;

                        $("#resetcode-section").addClass("hidden");
                        $("#password-section").removeClass("hidden");
                        $("h1").text("Enter a new password");
                        $(".subtitle").text("Keep it strong and secure");
                    }
                    else if (data.status === 404 || data.status === 401) {
                        displayAlert("Incorrect reset code, try again", "#resetcode");
                    }
                    else if (data.status === 500) {
                        displayAlert("Internal server error", "#resetcode");
                    }
                });
            }
        }
        else {
            var delivery_type = "email";

            $.post("/api/accounts/resetcode", {username, delivery_type}, function(data, status){
                if (data.status === 202) {
                    var email = data.data.email;
                    var emailUsername = email.split("@")[0];
                    var emailDomain = "@"+email.split("@")[1];
                    var len = emailUsername.length;
                    var firstChar = emailUsername.slice(0,1);
                    var lastTwoChars = emailUsername.slice(len-2, len);
                    var astericks = "";

                    for (var i = 0; i < len - 3; i++) {
                        astericks += "*";
                    }

                    var emailToShow = firstChar+astericks+lastTwoChars+emailDomain;

                    onCodeField = true;
                    $("#resetcode-section").removeClass("hidden");
                    $("#username-section").addClass("hidden");
                    $("h1").text("Reset code sent");
                    $(".subtitle").text("A 6-digit reset code has been sent to "+emailToShow);
                }
                else {
                    if (data.data.errorCode === "no_account_found") {
                        displayAlert("Account not found with that username", "#username");
                    }
                    else if (data.data.errorCode === "internal_server_error") {
                        displayAlert("Internal server error, try again later", "#username");
                    }
                }
            })
        }
    }

    $("button").removeClass("loading");
}

$("#password").keyup(function(){
    var password = $("#password").val();
    var username = $("#username").val();

    updatePasswordStrengthBar(password, [username]);
});

$("#resetcode-helper-link").click(function(){
    resetErrors();
    turnOffSuccess("#resetcode");

    var delivery_type = "email";

    $.post("/api/accounts/resetcode", {username, delivery_type}, function(data, status){
        if (data.status === 202) {
            displaySuccess("Reset code sent :)", "#resetcode");
        }
        else {
            if (data.data.errorCode === "no_account_found") {
                displayAlert("Account not found with that username", "#username");
            }
            else if (data.data.errorCode === "internal_server_error") {
                displayAlert("Internal server error, try again later", "#username");
            }
        }
    });
});

$("#resetcode").focus(function(){
    turnOffSuccess("#resetcode");
});

$("#login-btn").click(function(){
    window.location.href = "/login?"+params+"&username_prefill="+username;
});

$("#continue-btn").click(executeContinue);

$(document).on('keypress', function(e){
    if (e.which === 13) executeContinue();
});