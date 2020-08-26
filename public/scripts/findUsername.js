var callback = getParameterByName("callback");
var aidn = getParameterByName("aidn");
var appName = getParameterByName("appname");
var params = "appname="+appName+"&aidn="+aidn+"&callback="+callback;

var username;

window.onload = function() {
    $("#email").val("");
};

function findUsername() {
    $("button").addClass("loading");
    resetErrors();

    var email = $("#email").val();

    if (email === "") {
        displayAlert("Please enter an email", "#email");
    }
    else {
        if (!validateEmail(email)) {
            displayAlert("Please enter a valid email", "#email");
        }
        else {
            $.post("/api/convertemail", {email}, function(data, status){
                if (data.status === 404) {
                    if (data.data.errorCode === "account_not_found") {
                        displayAlert("No account found with this email", "#email");
                    }
                }
                else {
                    username = data.data.username;
                    var fname = data.data.fname;
    
                    $("#email").addClass("hidden");
                    $("#findusername-btn").addClass("hidden");
                    $("#gotologin-btn").removeClass("hidden");
                    $("h1").text(fname+", we found it!");
                    $(".subtitle").text("Your username is '"+username+"'");
                    
                }
            });
        }
    }

    $("button").removeClass("loading");
}

$("#gotologin-btn").click(function(){
    window.location.href = "/login?"+params+"&username_prefill="+username;
});

$("#signup-btn").click(function(){
    window.location.href = "/signup?"+params;
});
 
$("#findusername-btn").click(findUsername);

$(document).on('keypress', function(e){
    if (e.which === 13) findUsername();
});