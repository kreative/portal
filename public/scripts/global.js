$("#customer-support-link").click(function(){
    window.location.href = "https://kreative.im/support?source=portal";
});

function HSVtoRGB(h, s, v) {
    var r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
}

function setLogoColor() {
    var goldenRatio = 0.618033988749895;
    var h = 1 / (Math.random() + goldenRatio);
    var rgb = HSVtoRGB(h, 0.99, 0.99);
    var color = "rgb("+rgb.r+","+rgb.g+","+rgb.b+")";

    $("#kreativelogo").css("fill", color);
}

window.onload = function() {
    setLogoColor();
}