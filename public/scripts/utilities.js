function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

function displayAlert(text, element) {
    $(element+"-alert").removeClass("hidden");
    $(element+"-alert #text").text(text);
    $(element).addClass("error");
}

function displaySuccess(text, element) {
    $(element+"-message").removeClass("hidden");
    $(element+"-message #text").text(text);
    $(element).addClass("success");
}

function hideAlert() {
    $(".alert").addClass("hidden");
}

function resetErrors() {
    hideAlert();
    $(".input_text").removeClass("error");
}

function turnOffErrors(element) {
    $(element+"-alert").addClass("hidden");
    $(element).removeClass("error");
}

function turnOffSuccess(element) {
    $(element+"-message").addClass("hidden");
    $(element).removeClass("success");
}