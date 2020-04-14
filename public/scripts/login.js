var onPasswordField = false;

var url = window.location.href;
var parameters = url.split("?")[1];
var signupURL = "/signup?"+parameters;
var findUsernameURL = "/findusername?"+param

$("#username").focus(function(){
    $(this).removeClass("error");
});

$("#signup-btn").click(function(){
    window.location.href = "{{ signupUrl }}";
});

$("#username-helper-link").click(function(){
    window.location.href = "{{ findUsernameUrl }}"
});

$("#continue-btn").click(function(){
    if (onPasswordField) {

    }
    else {
        var username = $("#username").val();
        $.get("/api/check/u/"+username, function(data, status){
            if (data.exists === true) {
            
            }
            else {
                
                $("#username").addClass("error");
            }
        });
    }
});
