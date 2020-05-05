var token = getParameterByName("token");

window.onload = function() {
    $.post('/api/accounts/verifyemail', {token}, function(data, status){
        if (data.status === 401) {
            $("h1").text("Uh oh!");
            $("p").text("Email verification failed. Try again later.");
        }
        else if (data.status === 500) {
            $("h1").text("Internal Server Error");
            $("p").text("Email verification failed. Try again later.");
        }

        $("#verifyemail-contents").removeClass("hidden");
    });
}