        const board = data["Board"];
        const moves = [];

        // TODO: jump/king
        [...board].forEach((item, index) => {
            if ((item[0] !== "1") && (item[0] !== "3")) {
                return;
            }

            /*/
            const row = Math.trunc(index / 4);
            let dest = null;

            let index2 = index + 4 - (row % 2);
            if ((index2 > -1) && (index2 < board.length)) {
                if (((row % 2) === 1) && ((index % 4) === 0)) {
                    ;
                }
                else {
                    dest = Math.trunc(index2 / 4);
                    if (dest === (row + 1)) {
                        if (board[index2] === "0") {
                            moves.push({
                                "from": { "row": row, "col": (index % 4) },
                                "to": [{ "row": dest, "col": (index2 % 4) }]
                            });
                        }
                    }
                }

                if (((row % 2) === 0) && ((index % 4) === 3)) {
                    ;
                }
                else {
                    dest = Math.trunc((index2 + 1) / 4);
                    if (dest === (row + 1)) {
                        if (board[(index2 + 1)] === "0") {
                            moves.push({
                                "from": { "row": row, "col": (index % 4) },
                                "to": [{ "row": dest, "col": ((index2 + 1) % 4) }]
                            });
                        }
                    }
                }
            }

            if (item[0] === "3") {
                let indexK = index - 4 + ((row + 1) % 2);
                if ((indexK > -1) && (indexK < board.length)) {
                    if (((row % 2) === 0) && ((index % 4) === 3)) {
                        ;
                    }
                    else {
                        dest = Math.trunc(indexK / 4);
                        if (dest === (row - 1)) {
                            if (board[indexK] === "0") {
                                moves.push({
                                    "from": { "row": row, "col": (index % 4) },
                                    "to": [{ "row": dest, "col": (indexK % 4) }]
                                });
                            }
                        }
                    }

                    if (((row % 2) === 1) && ((index % 4) === 0)) {
                        ;
                    }
                    else {
                        dest = Math.trunc((indexK - 1) / 4);
                        if (dest === (row - 1)) {
                            if (board[(indexK - 1)] === "0") {
                                moves.push({
                                    "from": { "row": row, "col": (index % 4) },
                                    "to": [{ "row": dest, "col": ((indexK - 1) % 4) }]
                                });
                            }
                        }
                    }
                }
            }
            //*/
        });

        if (moves.length === 0) {
            [...board].forEach((item, index) => {
                if ((item[0] !== "1") && (item[0] !== "3")) {
                    return;
                }

                const row = Math.trunc(index / 4);
                let dest = null;

                let index2 = index + 4 - (row % 2);
                if ((index2 > -1) && (index2 < board.length)) {
                    if (((row % 2) === 1) && ((index % 4) === 0)) {
                        ;
                    }
                    else {
                        dest = Math.trunc(index2 / 4);
                        if (dest === (row + 1)) {
                            if (board[index2] === "0") {
                                moves.push({
                                    "from": { "row": row, "col": (index % 4) },
                                    "to": [{ "row": dest, "col": (index2 % 4) }]
                                });
                            }
                        }
                    }

                    if (((row % 2) === 0) && ((index % 4) === 3)) {
                        ;
                    }
                    else {
                        dest = Math.trunc((index2 + 1) / 4);
                        if (dest === (row + 1)) {
                            if (board[(index2 + 1)] === "0") {
                                moves.push({
                                    "from": { "row": row, "col": (index % 4) },
                                    "to": [{ "row": dest, "col": ((index2 + 1) % 4) }]
                                });
                            }
                        }
                    }
                }

                if (item[0] === "3") {
                    let indexK = index - 4 + ((row + 1) % 2);
                    if ((indexK > -1) && (indexK < board.length)) {
                        if (((row % 2) === 0) && ((index % 4) === 3)) {
                            ;
                        }
                        else {
                            dest = Math.trunc(indexK / 4);
                            if (dest === (row - 1)) {
                                if (board[indexK] === "0") {
                                    moves.push({
                                        "from": { "row": row, "col": (index % 4) },
                                        "to": [{ "row": dest, "col": (indexK % 4) }]
                                    });
                                }
                            }
                        }

                        if (((row % 2) === 1) && ((index % 4) === 0)) {
                            ;
                        }
                        else {
                            dest = Math.trunc((indexK - 1) / 4);
                            if (dest === (row - 1)) {
                                if (board[(indexK - 1)] === "0") {
                                    moves.push({
                                        "from": { "row": row, "col": (index % 4) },
                                        "to": [{ "row": dest, "col": ((indexK - 1) % 4) }]
                                    });
                                }
                            }
                        }
                    }
                }
            });
        }

        if (moves.length === 0) {
            return (null);
        }
        const index = Math.floor(Math.random() * moves.length);
        return (moves[index]);
