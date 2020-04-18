function validateUsername(username) {
    var splChars = "~`!#$%^&*+=-[]\\\';,/{}|\":<>?";
    var spaceChar = " ";

    for (var i = 0; i < username.length; i++) {
        var checkSpl = splChars.indexOf(username.charAt(i));
        var checkSpc = spaceChar.indexOf(username.charAt(i));

        if (checkSpl != -1 || checkSpc != -1) {
            return false;
        }
    }
    return true;
}

function validateEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    
    return re.test(email);
}

function containsEmptyVal(values) {
    var len = values.length;

    for (var i = 0; i < len; i++) {
        if (values[i] === "") {
            return true;
        }
    }
    return false;
}

function evaluateEmptiness(username, password, fname, lname, email, callback) {
    var values = [username, password, fname, lname, email];
    
    if (containsEmptyVal(values)) {
        if (fname === "" || lname === "") {
            $("#name-section-alert").removeClass("hidden").text("Full name required");
            if (fname === "") $("#fname").addClass("error");
            if (lname === "") $("#lname").addClass("error");
        }
        if (email === "") displayAlert("Email required", "#email");
        if (username === "") displayAlert("Username required", "#username");
        if (password === "") displayAlert("Password required", "#password");
    }
    else callback();
}

function updatePasswordStrengthBar(password, personalVals) {
    var result = zxcvbn(password, personalVals);

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
}