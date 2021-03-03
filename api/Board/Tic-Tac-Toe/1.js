"use strict";

module.exports = {
    move: function (data) {
        const m = data["Board"].indexOf("0");
        if (m === -1) {
            return ({});
        }
        return ({
            "row": Math.trunc(m / 3),
            "col": m % 3
        });

    }
};