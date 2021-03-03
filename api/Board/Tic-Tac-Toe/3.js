"use strict";

module.exports = {
    move: function (data) {
        let indexes = [];
        for (let c = 0; c < data["Board"].length; c++) {
            if (data["Board"][c] === "0") {
                indexes.push(c);
            }
        }
        if (indexes.length === 0) {
            return ({});
        }
        const index = Math.floor(Math.random() * indexes.length);
        return ({
            "row": Math.trunc(indexes[index] / 3),
            "col": indexes[index] % 3
        });

    }
};