var usernameTimerId;
var emailTimerId;
var portalKey;
var usernameWorks = false;
var emailWorks = false;
var url = window.location.href;
var params = url.split("?")[1];

window.onload = function() {
    $("#username").val("");
    $("#password").val("");
    $("#fname").val("");
    $("#lname").val("");
    $("#email").val("");
};

function executeSignup() {
    var username = $("#username").val();
    var password = $("#password").val();
    var fname = $("#fname").val();
    var lname = $("#lname").val();
    var email = $("#email").val();
    var AIDN = getParameterByName("aidn");

    resetErrors();

    evaluateEmptiness(
        username,
        password,
        fname,
        lname,
        email,
    function(){
        if (usernameWorks) {
            if (emailWorks) {
                $.post("/api/accounts/signup", {
                    username,
                    fname,
                    lname,
                    email,
                    password,
                    AIDN
                }, function(data, status){
                    if (data.status === 202) {
                        var appnameRaw = getParameterByName("appname");
                        var appname = appnameRaw.replace("+", " ");

                        portalKey = data.data.key;
                        $("#form-section").addClass("hidden");
                        $("h1").text("You're all done!");
                        $(".subtitle").text(fname+", you're all set to go back to "+appname);
                        $("#goback-section").removeClass("hidden");
                    }
                    else if (data.status === 500) {
                        if (data.data.errorCode === "email_or_phone_inuse") {
                            displayAlert("Email is inuse, please use another", "#email");
                        }
                        else alert("Internal server error, please try again later");
                    }

                });
            }
            else displayAlert("Enter a valid email", "#email");
        }
        else displayAlert("Enter a valid username", "#username");
    });
}

$("#username").keyup(function(){
    turnOffErrors("#username");
    turnOffSuccess("#username");
    clearTimeout(usernameTimerId);

    usernameTimerID = setTimeout(function(){
        var username = $("#username").val();

        if (username !== "") {
            if (validateUsername(username) === true) {
                $.get("/api/check/u/"+username, function(data, status){
                    if (data.data.exists === true) {
                        usernameWorks = false;
                        displayAlert("Username is already taken", "#username")
                    }
                    else {
                        usernameWorks = true;
                        displaySuccess("#username");
                    }
                });
            }
            else {
                usernameWorks = false;
                displayAlert("Only use letters, numbers, '_', '.', spaces are not allowed", "#username");   
            }
        }
    }, 1000);
});

$("#email").keyup(function(){
    turnOffErrors("#email");
    clearTimeout(emailTimerId);

    emailTimerId = setTimeout(function(){
        var email = $("#email").val();

        if (email !== "") {
            if (validateEmail(email) === true) {
                $.get("/api/check/e/"+email, function(data, status){
                    if (data.data.exists === true) {
                        emailWorks = false;
                        displayAlert("Email already in use", "#email")
                    }
                    else emailWorks = true;
                });
            }
            else {
                emailWorks = false;
                displayAlert("Please enter a valid email", "#email");   
            }
        }
    }, 1000);
});

$("#password").keyup(function(){
    var password = $("#password").val();
    var username = $("#username").val();
    var email = $("#email").val();
    var result = zxcvbn(password, [username, email]);

    if (password !== "") {
        if (result.score <= 2) {
            $("#bar")
                .css("width", "30%")
                .css("background-color", "#B51C1C");
        }
        else if (result.score === 3) {
            $("#bar")
                .css("width", "70%")
                .css("background-color", "#FFB800");
        }
        else {
            $("#bar")
                .css("width", "100%")
                .css("background-color", "#176A3A");
        }
    }
    else $("#bar").css("width", "0%");
});

$("#username").blur(function(){
    turnOffSuccess("#username");
});

$("#login-btn").click(function(){
    window.location.href = "/login?"+params;
});

$("#goback-btn").click(function(){
    var callbackRaw = getParameterByName("callback");
    var callback = decodeURIComponent(callbackRaw);

    window.location.href = callback+"?key="+portalKey;
});

$("#continue-btn").click(executeSignup);

$(document).on('keypress', function(e){
    if (e.which === 13) {
        executeSignup();
    }
});