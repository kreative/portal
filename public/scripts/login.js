var onPasswordField = false;
var url = window.location.href;
var params = url.split("?")[1];

function executeContinue() {
    $("#alert-box").addClass("hidden");
    $("button").addClass("loading");
    $("#username").removeClass("error");

    if ($("#username").val() === "") {
        $("#alert-box").text("Please enter a username").removeClass("hidden");
        $("#username").addClass("error");
    }
    else {
        if (onPasswordField) {
            var username = $("#username").val();
            var password = $("#password").val();
            var AIDN = getParameterByName("aidn");

            console.log(username);
            console.log(password);
            console.log(AIDN);
    
            $.post("/api/accounts/login", {username,password,AIDN}, function(data, status){
                if (data.status === 202) {
                    var key = data.data.key;
                    var callback = decodeURIComponent(getParameterByName("callback"));
    
                    window.location.href = callback+"?key="+key;
                }
                else if (data.status === 406) {
                    $("#alert-box").text("Password incorrect, try again").removeClass("hidden");
                    $("#username").addClass("error");
                }
                else if (data.status === 404) {
                    $("#alert-box").text("Account not found").removeClass("hidden");
                    $("#username").addClass("error");
                }
                else {
                    $("#alert-box").text("Internal server error, please try again later :(").removeClass("hidden");
                    $("#username").addClass("error");
                }
            });
        }
        else {
            var username = $("#username").val();
    
            $.get("/api/check/u/"+username, function(data, status){
                if (data.data.exists === true) {
                    var fname = data.data.fname;
                    onPasswordField = true;

                    $("#username-helper-link").addClass("hidden");
                    $("h1").text("Welcome back, "+fname);
                    $(".subtitle").text("Enter your password to continue");
                    $("#password").removeClass("hidden");
                    $("#password-helper-link").removeClass("hidden");
                }
                else {
                    $("#alert-box").text("Username not found").removeClass("hidden");
                    $("#username").addClass("error");
                }
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
