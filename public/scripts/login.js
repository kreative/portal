var onPasswordField = false;
var url = window.location.href;
var params = url.split("?")[1];

function executeContinue() {
    $("button").addClass("loading");
    resetErrors();

    if ($("#username").val() === "") {
        displayAlert("Please enter a username", "#username");
    }
    else {
        if (onPasswordField) {
            var username = $("#username").val();
            var password = $("#password").val();
            var AIDN = getParameterByName("aidn");
    
            $.post("/api/accounts/login", {username,password,AIDN}, function(data, status){
                if (data.status === 202) {
                    var key = data.data.key;
                    var callback = decodeURIComponent(getParameterByName("callback"));
    
                    window.location.href = callback+"?key="+key;
                }
                else if (data.status === 406) displayAlert("Password incorrect, try again", "#password");
                else if (data.status === 404) displayAlert("Account not found", "#password");
                else if (data.status === 500) displayAlert("Internal server error!", "#password");
            });
        }
        else {
            var username = $("#username").val();
    
            $.post("/api/check", {type:"username",cred:username}, function(data, status){
                if (data.data.exists === true) {
                    var fname = data.data.fname;
                    onPasswordField = true;

                    $("#username-helper-link").addClass("hidden");
                    $("h1").text("Welcome back, "+fname);
                    $(".subtitle").text("Enter your password to continue");
                    $("#password").removeClass("hidden");
                    $("#password-helper-link").removeClass("hidden");
                }
                else displayAlert("Account not found with that username", "#username");
            });
        }
    }

    $("button").removeClass("loading");
}

$("#signup-btn").click(function(){
    window.location.href = "/signup?"+params;
});

$("#username-helper-link").click(function(){
    window.location.href = "/findusername?"+params;
});

$("#password-helper-link").click(function(){
    window.location.href = "/passwordreset"+params;
});

$("#continue-btn").click(executeContinue);

$(document).on('keypress', function(e){
    if (e.which === 13) {
        executeContinue();
    }
});
