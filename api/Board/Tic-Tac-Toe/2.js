"use strict";
module.exports = {
  move: function (data) {
        const m = data["Board"].indexOf("0");
        if (m === -1) {
            return ({});
        }
        for (let c = 0; c < 3; c++) {
            for (let r = 0; r < 3; r++) {
                if (data["Board"][(r * 3) + c] === "0") {
                    return ({
                        "row": r,
                        "col": c
                    });
                }
            }
        }
        return ({});

    }
};