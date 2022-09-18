var mysql = require('mysql');
var express = require('express');
var router = express.Router();
var verifyAuth = require('./google-auth');
var crypto = require('crypto');
var emailValidator = require('deep-email-validator');

database = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "covid19",
    database: 'user_db',
});

function asyncWhile(condition, doThis, callback) {
    function a() {
        if (condition()) {
            doThis(a, callback);
        } else {
            callback(null);
        }
    }
    a();
}

async function validateEmail(email, callback) {
    var mailres = await emailValidator.validate({
        email: email,
        validateRegex: true,
        validateMx: true,
        validateType: true,
        validateSMTP: false,
    });
    callback(mailres);
}

var checkSession = function(req, res, callback) {
    var user = {
        valid: false,
        user_id: '',
        exposed: false,
        permissions: 0,
        given_name: '',
        family_name: '',
        email: '',
    };
    if (req.cookies.session_auth) {
        req.session.session_id = req.cookies.session_auth;
        var session = req.cookies.session_auth.replace(/[^a-zA-Z0-9]+/g, '');
        if (session == req.cookies.session_auth) {
            database.query("SELECT * FROM users JOIN sessions ON users.user_id = sessions.user_id WHERE session_id = ?", session, (err, rows) => {
                if (err) {
                    callback(err, user);
                    return;
                } else {
                    if (rows.length > 0) {
                        user = {
                            valid: true,
                            user_id: rows[0].user_id,
                            exposed: rows[0].exposed,
                            permissions: (rows[0].permissions) ? rows[0].permissions : 0,
                            given_name: rows[0].given_name,
                            family_name: rows[0].family_name,
                            email: rows[0].email,
                        };
                        callback(null, user);
                        return;
                    } else {
                        callback(null, user);
                        return;
                    }
                }
            });
        } else {
            callback(null, user);
            return;
        }
    } else {
        req.session.session_id = null;
        callback(null, user);
        return;
    }
};

database.connect((err) => {
    if (err) {
        console.log(err);
    } else {
        router.get("/checksession", (req, res) => {
            checkSession(req, res, (err, user) => {
                if (err) {
                    console.log(err);
                    res.send(JSON.stringify(user));
                } else {
                    res.send(JSON.stringify(user));
                }
            });
        });
        router.post("/updates", (req, res) => {
            if (req.body.t) {
                req.body.t.replace(/[^0-9]+/g, '');
                var time = parseInt(req.body.t.replace(/[^0-9]+/g, ''));
                database.query("SELECT update_id, title, content, date_time FROM updates WHERE date_time > DATE_ADD(CURRENT_TIMESTAMP, INTERVAL ? DAY) ORDER BY date_time DESC", -time, (err, rows) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (rows.length > 0) {
                            res.send(JSON.stringify(rows));
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                });
            } else {
                database.query("SELECT update_id, title, content, date_time FROM updates ORDER BY date_time DESC", (err, rows) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (rows.length > 0) {
                            res.send(JSON.stringify(rows));
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                });
            }
        });
        router.post("/addUpdate", (req, res) => {
            //updates: update_id | title | content | date_time
            if (req.body.header && req.body.content) {
                var title = req.body.header.replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;').replace(/[\n]/g, '<br>');
                var content = req.body.content.replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;').replace(/[\n]/g, '<br>');
                database.query("INSERT INTO updates (title, content) VALUES (?, ?)", [title, content], (err, rows) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        res.send(JSON.stringify(true));
                    }
                });
            } else {
                res.send(JSON.stringify(false));
            }
        });
        router.post("/confUpdate", (req, res) => {
            if (req.body.index && req.body.title && req.body.content) {
                var index = parseInt(req.body.index.replace(/[^0-9]+/g, ''));
                var title = req.body.title.replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;').replace(/[\n]/g, '<br>');
                var content = req.body.content.replace(/[<]/g, '&lt;').replace(/[>]/g, '&gt;').replace(/[\n]/g, '<br>');
                database.query("UPDATE updates SET title = ?, content = ? WHERE update_id = ?", [title, content, index], (err, result) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (result.affectedRows > 0) {
                            res.send(JSON.stringify(true));
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                });
            } else {
                res.send(JSON.stringify(false));
            }
        });
        router.post("/delUpdate", (req, res) => {
            if (req.body.index) {
                var index = parseInt(req.body.index.replace(/[^0-9]+/g, ''));
                database.query("DELETE FROM updates WHERE update_id = ?", index, (err, rows) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        res.send(JSON.stringify(true));
                    }
                });
            } else {
                res.send(JSON.stringify(false));
            }
        });
        router.get("/getexposures", (req, res) => {
            checkSession(req, res, (err, user) => {
                if (err) {
                    console.log(err);
                    res.send(JSON.stringify(false));
                } else {
                    if (user['valid']) {
                        var session = req.cookies.session_auth.replace(/[^a-zA-Z0-9]+/g, '');
                        if (session == req.cookies.session_auth) {
                            database.query("SELECT checkin.loc_id, locations.address, checkin.date_time, checkin.exposure_id, exposures.start_time, exposures.end_time FROM checkin JOIN locations ON checkin.loc_id = locations.loc_id JOIN exposures ON checkin.exposure_id = exposures.exposure_id JOIN sessions ON checkin.user_id = sessions.user_id WHERE sessions.session_id = ? AND checkin.exposure_id IN (SELECT exposure_id FROM exposures) ORDER BY checkin.date_time DESC", session, (err, rows) => {
                                if (err) {
                                    console.log(err);
                                    res.send(JSON.stringify(false));
                                } else {
                                    if (rows.length > 0) {
                                        res.send(JSON.stringify(rows));
                                    } else {
                                        res.send(JSON.stringify(false));
                                    }
                                }
                            });
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    } else {
                        res.send(JSON.stringify(false));
                    }
                }
            });
        });
        router.post("/getexposures", (req, res) => {
            if (req.body.user_id) {
                checkSession(req, res, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (user['permissions'] == 2) {
                            if (req.body.user_id.replace(/[^a-zA-Z0-9]+/g, '') == req.body.user_id) {
                                database.query("SELECT checkin.loc_id, locations.address, checkin.exposure_id, checkin.date_time FROM checkin JOIN locations ON checkin.loc_id = locations.loc_id WHERE checkin.user_id = ? AND checkin.exposure_id IN (SELECT exposure_id FROM exposures) ORDER BY checkin.date_time DESC", req.body.user_id.replace(/[^a-zA-Z0-9]+/g, ''), (err, rows) => {
                                    if (err) {
                                        console.log(err);
                                        res.send(JSON.stringify(false));
                                    } else {
                                        if (rows.length > 0) {
                                            res.send(JSON.stringify(rows));
                                        } else {
                                            res.send(JSON.stringify(false));
                                        }
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(false));
                            }
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                });
            }
        });
        router.post("/getlocexposures", (req, res) => {
            if (req.body.loc_id) {
                checkSession(req, res, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (user['permissions'] == 2) {
                            if (req.body.loc_id.replace(/[^a-zA-Z0-9]+/g, '') == req.body.loc_id) {
                                database.query("SELECT exposures.loc_id, locations.address, exposures.exposure_id, exposures.start_time, exposures.end_time FROM locations JOIN exposures ON exposures.loc_id = locations.loc_id WHERE exposures.loc_id = ? AND exposures.exposure_id IN (SELECT exposure_id FROM exposures) ORDER BY exposures.end_time DESC", req.body.loc_id.replace(/[^a-zA-Z0-9]+/g, ''), (err, rows) => {
                                    if (err) {
                                        console.log(err);
                                        res.send(JSON.stringify(false));
                                    } else {
                                        if (rows.length > 0) {
                                            res.send(JSON.stringify(rows));
                                        } else {
                                            res.send(JSON.stringify(false));
                                        }
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(false));
                            }
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                });
            }
        });
        router.post("/createloc", (req, res) => {
            if (req.body.loc_name && req.body.address && req.body.lat && req.body.lng) {
                checkSession(req, res, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (user['valid']) {
                            var loc_name = req.body.loc_name.replace(/[^0-9\/-;?-z= ]+/g, '');
                            var address = req.body.address.replace(/[^0-9\/-;?-z= ]+/g, '');
                            var lat = req.body.lat.replace(/[^0-9-\.]+/g, '');
                            var lng = req.body.lng.replace(/[^0-9-\.]+/g, '');
                            if (loc_name == req.body.loc_name && address == req.body.address && lat == req.body.lat && lng == req.body.lng) {
                                lat = parseFloat(lat);
                                lng = parseFloat(lng);
                                var unique = false;
                                var loc_id = Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 7);
                                asyncWhile(() => {
                                    return !unique;
                                }, (next, callback) => {
                                    database.query("SELECT * FROM locations WHERE loc_id = ?", loc_id, (err, rows) => {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            if (rows.length < 1) {
                                                unique = true;
                                            } else {
                                                loc_id = Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 7);
                                            }
                                            next();
                                        }
                                    });
                                }, (err) => {
                                    if (err) {
                                        console.log(err);
                                        res.send(JSON.stringify(false));
                                    } else {
                                        database.query("INSERT INTO locations (loc_id, owner_id, address, loc_name, lat, lng, exposed) VALUES (?, ?, ?, ?, ?, ?, false)", [loc_id, user['user_id'], address, loc_name, lat, lng], (err, result) => {
                                            if (err) {
                                                console.log(err);
                                                res.send(JSON.stringify(false));
                                            } else {
                                                res.send(JSON.stringify(true));
                                            }
                                        });
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(false));
                            }
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                });
            } else {
                res.send(JSON.stringify(false));
            }
        });
        router.post("/flagloc", (req, res) => {
            if (req.body.loc_id && req.body.start_time && req.body.end_time) {
                checkSession(req, res, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (user['valid'] && user['permissions'] == 2) {
                            console.log(req.body);
                            var loc_id = req.body.loc_id.replace(/[^a-zA-Z0-9]+/g, "");
                            var start_time = req.body.start_time.match(/^([1-2]\d{3}-([0]?[1-9]|1[0-2])-([0-2]?[0-9]|3[0-1])) (20|21|22|23|[0-1]?\d{1}):([0-5]?\d{1}):([0-5]?\d{1})$/g);
                            var end_time = req.body.end_time.match(/^([1-2]\d{3}-([0]?[1-9]|1[0-2])-([0-2]?[0-9]|3[0-1])) (20|21|22|23|[0-1]?\d{1}):([0-5]?\d{1}):([0-5]?\d{1})$/g);
                            if (start_time.length < 1 || end_time.length < 1) {
                                res.send(JSON.stringify(false));
                            } else {
                                start_time = start_time[0];
                                end_time = end_time[0];
                                if (start_time == req.body.start_time && end_time == req.body.end_time && loc_id == req.body.loc_id) {
                                    database.query("INSERT INTO exposures (loc_id, start_time, end_time) VALUES (?, ?, ?)", [loc_id, start_time, end_time], (err, result) => {
                                        if (err) {
                                            console.log(err);
                                            res.send(JSON.stringify(false));
                                        } else {
                                            database.query("UPDATE checkin SET exposure_id = LAST_INSERT_ID() WHERE loc_id = ? AND date_time BETWEEN ? AND ?", [loc_id, start_time, end_time], (err, result) => {
                                                if (err) {
                                                    console.log(err);
                                                    res.send(JSON.stringify(false));
                                                } else {
                                                    res.send(JSON.stringify(true));
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    res.send(JSON.stringify(false));
                                }
                            }
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                });
            } else {
                res.send(JSON.stringify(false));
            }
        });
        router.post("/flaguser", (req, res) => {
            if (req.body.user_id) {
                checkSession(req, res, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (user['permissions'] == 2) {
                            if (req.body.user_id.replace(/[^a-zA-Z0-9]+/g, '') == req.body.user_id) {
                                if (user['exposed']) {
                                    res.send(JSON.stringify(false));
                                } else {
                                    database.query("UPDATE users SET exposed = true WHERE user_id = ?", req.body.user_id.replace(/[^a-zA-Z0-9]+/g, ''), (err, rows) => {
                                        if (err) {
                                            console.log(err);
                                            res.send(JSON.stringify(false));
                                        } else {
                                            database.query("SELECT checkin_id, loc_id, date_time FROM checkin WHERE user_id = ? AND date_time BETWEEN DATE_ADD(CURRENT_TIMESTAMP, INTERVAL -7 DAY) AND CURRENT_TIMESTAMP", req.body.user_id.replace(/[^a-zA-Z0-9]+/g, ''), (err, checkin_rows) => {
                                                if (err) {
                                                    console.log(err);
                                                    res.send(false);
                                                } else {
                                                    console.log(checkin_rows);
                                                    if (checkin_rows.length > 0) {
                                                        var i = 0;
                                                        asyncWhile(() => {
                                                            return i < checkin_rows.length;
                                                        }, (next, callback) => {
                                                            database.query("INSERT INTO exposures (loc_id, start_time, end_time) VALUES (?, DATE_ADD(?, INTERVAL -1 HOUR), DATE_ADD(?, INTERVAL 4 HOUR))", [checkin_rows[i]['loc_id'], checkin_rows[i]['date_time'], checkin_rows[i]['date_time']], (err, rows) => {
                                                                if (err) {
                                                                    callback(err);
                                                                } else {
                                                                    database.query("UPDATE checkin SET exposure_id = LAST_INSERT_ID() WHERE loc_id = ? AND date_time BETWEEN DATE_ADD(?, INTERVAL -1 HOUR) AND DATE_ADD(?, INTERVAL 4 HOUR)", [checkin_rows[i]['loc_id'], checkin_rows[i]['date_time'], checkin_rows[i]['date_time']], (err, rows) => {
                                                                        if (err) {
                                                                            callback(err);
                                                                        } else {
                                                                            i += 1;
                                                                            next();
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }, (err) => {
                                                            if (err) {
                                                                console.log(err);
                                                                res.send(JSON.stringify(false));
                                                            } else {
                                                                res.send(JSON.stringify(true));
                                                            }
                                                        });
                                                    } else {
                                                        res.send(JSON.stringify(false));
                                                    }
                                                }
                                            });
                                        }
                                    });
                                }
                            } else {
                                res.send(JSON.stringify(false));
                            }
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                })
            } else {
                res.send(JSON.parse(false));
            }
        });
        router.post("/unflaguser", (req, res) => {
            if (req.body.user_id) {
                var uid = req.body.user_id
                checkSession(req, res, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (user['permissions'] == 2) {
                            if (uid.replace(/[^a-zA-Z0-9]+/g, '') == req.body.user_id) {
                                database.query("UPDATE users SET exposed = false WHERE user_id = ?", req.body.user_id.replace(/[^a-zA-Z0-9]+/g, ''), (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        res.send(JSON.stringify(false));
                                    } else {
                                        if (result.affectedRows > 0) {
                                            database.query("UPDATE checkin SET exposure_id = -1 WHERE user_id = ?", req.body.user_id.replace(/[^a-zA-Z0-9]+/g, ''), (err, result) => {
                                                if (err) {
                                                    console.log(err);
                                                    res.send(JSON.stringify(false));
                                                } else {
                                                    res.send(JSON.stringify(true));
                                                }
                                            });
                                        } else {
                                            res.send(JSON.stringify(false));
                                        }
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(false));
                            }
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                })
            } else {
                res.send(JSON.parse(false));
            }
        });
        router.post("/cfmAdmin", (req, res) => {
            if (req.body.user_id) {
                checkSession(req, res, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (user['permissions'] == 2) {
                            if (req.body.user_id.replace(/[^a-zA-Z0-9]+/g, '') == req.body.user_id) {
                                database.query("UPDATE users SET permissions = 2 WHERE user_id = ?", req.body.user_id.replace(/[^a-zA-Z0-9]+/g, ''), (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        res.send(JSON.stringify(false));
                                    } else {
                                        if (result.affectedRows > 0) {
                                            res.send(JSON.stringify(true));
                                        } else {
                                            res.send(JSON.stringify(false));
                                        }
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(false));
                            }
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                });
            } else {
                res.send(JSON.stringify(false));
            }
        });
        router.post("/checkin", (req, res) => {
            if (req.body.loc_id) {
                var loc_id = req.body.loc_id.replace(/[^a-zA-Z0-9]+/g, '');
                var session = req.cookies.session_auth.replace(/[^a-zA-Z0-9]+/g, '');
                if (loc_id == req.body.loc_id && session == req.cookies.session_auth) {
                    checkSession(req, res, (err, user) => {
                        if (err) {
                            console.log(err);
                            res.send(JSON.stringify(false));
                        } else {
                            if (user['valid']) {
                                database.query("SELECT sessions.user_id, users.exposed FROM sessions JOIN users ON sessions.user_id = users.user_id WHERE sessions.session_id = ?", session, (err, user_rows) => {
                                    if (err) {
                                        console.log(err);
                                        res.send(JSON.stringify(false));
                                    } else {
                                        if (user_rows.length > 0) {
                                            database.query("SELECT * FROM locations WHERE loc_id = ?", loc_id, (err, loc_rows) => {
                                                if (err) {
                                                    console.log(err);
                                                    res.send(JSON.stringify(false));
                                                } else {
                                                    if (loc_rows.length > 0) {
                                                        database.query("INSERT INTO checkin (user_id, loc_id) VALUES (?, ?)", [user_rows[0]['user_id'], loc_id], (err, rows) => {
                                                            if (err) {
                                                                console.log(err);
                                                                res.send(JSON.stringify(false));
                                                            } else {
                                                                if (user_rows[0]['exposed'] || loc_rows[0]['exposed']) {
                                                                    database.query("SELECT * FROM checkin WHERE checkin_id = LAST_INSERT_ID()", (err, checkin_rows) => {
                                                                        if (err) {
                                                                            console.log(err);
                                                                            res.send(JSON.stringify(false));
                                                                        } else {
                                                                            database.query("INSERT INTO exposures (loc_id, start_time, end_time) SELECT ?, DATE_ADD(CURRENT_TIMESTAMP, INTERVAL -1 HOUR), DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 4 HOUR) FROM dual WHERE NOT EXISTS (SELECT * FROM exposures WHERE DATE_ADD(CURRENT_TIMESTAMP, INTERVAL -1 HOUR) BETWEEN start_time AND end_time AND loc_id = ?)", [loc_id, loc_id], (err, result) => {
                                                                                if (err) {
                                                                                    console.log(err);
                                                                                    res.send(JSON.stringify(false));
                                                                                } else {
                                                                                    if (result.affectedRows > 0) {
                                                                                        database.query("UPDATE checkin SET exposure_id = LAST_INSERT_ID() WHERE checkin_id = ? AND date_time BETWEEN DATE_ADD(?, INTERVAL -1 HOUR) AND DATE_ADD(?, INTERVAL 4 HOUR)", [checkin_rows[0]['checkin_id'], checkin_rows[0]['date_time'], checkin_rows[0]['date_time']], (err, rows) => {
                                                                                            if (err) {
                                                                                                console.log(err);
                                                                                                res.send(JSON.stringify(false));
                                                                                            } else {
                                                                                                res.send(JSON.stringify(true));
                                                                                            }
                                                                                        });
                                                                                    } else {
                                                                                        database.query("SELECT * FROM exposures WHERE DATE_ADD(CURRENT_TIMESTAMP, INTERVAL -1 HOUR) BETWEEN start_time AND end_time AND loc_id = ?", loc_id, (err, rows) => {
                                                                                            if (err) {
                                                                                                console.log(err);
                                                                                                res.send(JSON.stringify(false));
                                                                                            } else {
                                                                                                database.query("UPDATE checkin SET exposure_id = ? WHERE checkin_id = ? AND date_time BETWEEN DATE_ADD(?, INTERVAL -1 HOUR) AND DATE_ADD(?, INTERVAL 4 HOUR)", [rows[0]['exposure_id'], checkin_rows[0]['checkin_id'], checkin_rows[0]['date_time'], checkin_rows[0]['date_time']], (err, result) => {
                                                                                                    if (err) {
                                                                                                        console.log(err);
                                                                                                        res.send(JSON.stringify(false));
                                                                                                    } else {
                                                                                                        if (result.affectedRows > 0) {
                                                                                                            res.send(JSON.stringify(true));
                                                                                                        } else {
                                                                                                            res.send(JSON.stringify(false));
                                                                                                        }
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                } else {
                                                                    res.send(JSON.stringify(true));
                                                                }
                                                            }
                                                        });
                                                    } else {
                                                        res.send(JSON.stringify(false));
                                                    }
                                                }
                                            });
                                        } else {
                                            res.send(JSON.stringify(false));
                                        }
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(false));
                            }
                        }
                    });
                } else {
                    res.send(JSON.stringify(false));
                }
            } else {
                res.send(JSON.stringify(false));
            }
        });
        router.post("/updateinfo", (req, res) => {
            if (req.body.given_name && req.body.family_name) {
                checkSession(req, res, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (user['valid']) {
                            var given_name = req.body.given_name.replace(/[^a-zA-Z0-9]+/g, '');
                            var family_name = req.body.family_name.replace(/[^a-zA-Z0-9]+/g, '');
                            var session = req.cookies.session_auth.replace(/[^a-zA-Z0-9]+/g, '');

                            if (given_name == req.body.given_name && family_name == req.body.family_name && session == req.cookies.session_auth) {
                                database.query("UPDATE users JOIN sessions ON users.user_id = sessions.user_id SET users.given_name = ?, users.family_name = ? WHERE sessions.session_id = ?", [given_name, family_name, session], (err, result) => {
                                    if (err) {
                                        console.log(err);
                                        res.send(JSON.stringify(false));
                                    } else {
                                        if (result.affectedRows > 0) {
                                            res.send(JSON.stringify(true));
                                        } else {
                                            res.send(JSON.stringify(false));
                                        }
                                    }
                                });
                            }
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                });
            } else {
                console.log(err);
                res.send(JSON.stringify(false));
            }
        });
        router.post("/updatelocinfo", (req, res) => {
            if (req.body.loc_name && req.body.address && req.body.loc_id) {
                checkSession(req, res, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (user['valid']) {
                            var loc_id = req.body.loc_id.replace(/[^a-zA-Z0-9]+/g, '');
                            var loc_name = req.body.loc_name.replace(/[^0-9\/-;?-z= ]+/g, '');
                            var address = req.body.address.replace(/[^0-9\/-;?-z= ]+/g, '');
                            var session = req.cookies.session_auth.replace(/[^a-zA-Z0-9]+/g, '');
                            if (loc_name == req.body.loc_name && address == req.body.address && loc_id == req.body.loc_id) {
                                database.query("SELECT * FROM locations JOIN sessions ON locations.owner_id = sessions.user_id WHERE locations.loc_id = ?", loc_id, (err, rows) => {
                                    if (err) {
                                        console.log(err);
                                        res.send(JSON.stringify(false));
                                    } else {
                                        if (rows.length > 0) {
                                            database.query("UPDATE locations SET locations.loc_name = ?, locations.address = ? WHERE locations.loc_id = ?", [loc_name, address, loc_id], (err, result) => {
                                                if (err) {
                                                    console.log(err);
                                                    res.send(JSON.stringify(false));
                                                } else {
                                                    if (result.affectedRows > 0) {
                                                        res.send(JSON.stringify(true));
                                                    } else {
                                                        res.send(JSON.stringify(false));
                                                    }
                                                }
                                            });
                                        } else {
                                            res.send(JSON.stringify(false));
                                        }
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(false));
                            }
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                });
            } else {
                res.send(JSON.stringify(false));
            }
        });
        router.post("/gethistory", (req, res) => {
            var where_ext = "";
            if (req.body.t) {
                if (req.body.t == req.body.t.replace(/[^0-9]/g, "")) {
                    var t = parseInt(req.body.t);
                    where_ext = "AND checkin.date_time BETWEEN DATE_ADD(CURRENT_TIMESTAMP, INTERVAL " + -t + " DAY) AND CURRENT_TIMESTAMP";
                }
            }
            if (req.body.user_id) {
                checkSession(req, res, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (user['permissions'] == 2) {
                            //Somehow return ADDRESS from 'lat' & 'lng' columns too?
                            //Returns to search_location.js
                            if (req.body.user_id.replace(/[^a-zA-Z0-9]+/g, '') == req.body.user_id) {
                                database.query("SELECT checkin.loc_id, locations.loc_name, locations.address, checkin.date_time, checkin.exposure_id, locations.lat, locations.lng FROM checkin JOIN locations ON checkin.loc_id = locations.loc_id WHERE checkin.user_id = ? " + where_ext + " ORDER BY checkin.date_time DESC", req.body.user_id.replace(/[^a-zA-Z0-9]+/g, ''), (err, rows) => {
                                    if (err) {
                                        console.log(err);
                                        res.send(JSON.stringify(false));
                                    } else {
                                        if (rows.length > 0) {
                                            res.send(JSON.stringify(rows));
                                        } else {
                                            res.send(JSON.stringify(false));
                                        }
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(false));
                            }
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                });
            } else {
                checkSession(req, res, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (user['valid']) {
                            var session = req.cookies.session_auth.replace(/[^a-zA-Z0-9]+/g, '');
                            if (session == req.cookies.session_auth) {
                                database.query("SELECT checkin.loc_id, locations.loc_name, locations.address, checkin.date_time, checkin.exposure_id, locations.lat, locations.lng FROM checkin JOIN sessions ON checkin.user_id = sessions.user_id JOIN locations ON checkin.loc_id = locations.loc_id WHERE sessions.session_id = ? " + where_ext + " ORDER BY checkin.date_time DESC", session, (err, rows) => {
                                    if (err) {
                                        console.log(err);
                                        res.send(JSON.stringify(false));
                                    } else {
                                        if (rows.length > 0) {
                                            res.send(JSON.stringify(rows));
                                        } else {
                                            res.send(JSON.stringify(false));
                                        }
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(false));
                            }
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                });
            }
        });
        router.post("/getlochistory", (req, res) => {
            if (req.body.loc_id) {
                checkSession(req, res, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (user['permissions'] == 2) {
                            //Somehow return ADDRESS from 'lat' & 'lng' columns too?
                            //Returns to search_location.js
                            if (req.body.loc_id.replace(/[^a-zA-Z0-9]+/g, '') == req.body.loc_id) {
                                database.query("SELECT checkin.user_id, locations.address, checkin.date_time FROM checkin JOIN locations ON checkin.loc_id = locations.loc_id WHERE checkin.loc_id = ? ORDER BY checkin.date_time DESC", req.body.loc_id.replace(/[^a-zA-Z0-9]+/g, ''), (err, rows) => {
                                    if (err) {
                                        console.log(err);
                                        res.send(JSON.stringify(false));
                                    } else {
                                        if (rows.length > 0) {
                                            res.send(JSON.stringify(rows));
                                        } else {
                                            res.send(JSON.stringify(false));
                                        }
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(false));
                            }
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                });
            } else {
                res.send(JSON.stringify(false));
            }
        });
        router.post("/getaccount", (req, res) => {
            if (req.body.user_id) {
                checkSession(req, res, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (user['permissions'] == 2) {
                            if (req.body.user_id.replace(/[^a-zA-Z0-9]+/g, '') == req.body.user_id) {
                                database.query("SELECT given_name, family_name, email, exposed FROM users WHERE user_id = ?", req.body.user_id.replace(/[^a-zA-Z0-9]+/g, ''), (err, rows) => {
                                    if (err) {
                                        console.log(err);
                                        res.send(JSON.stringify(false));
                                    } else {
                                        if (rows.length > 0) {
                                            res.send(JSON.stringify(rows[0]));
                                        } else {
                                            res.send(JSON.stringify(false));
                                        }
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(false));
                            }
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                })
            } else {
                res.send(JSON.parse(false));
            }
        });
        router.post("/getlocations", (req, res) => {
            if (req.body.user_id) {

            } else {
                checkSession(req, res, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (user['valid']) {
                            var session = req.cookies.session_auth.replace(/[^a-zA-Z0-9]+/g, '');
                            database.query("SELECT locations.loc_id, locations.loc_name FROM locations JOIN sessions ON locations.owner_id = sessions.user_id WHERE sessions.session_id = ?", session, (err, rows) => {
                                if (err) {
                                    console.log(err);
                                    res.send(JSON.stringify(false));
                                } else {
                                    if (rows.length > 0) {
                                        res.send(JSON.stringify(rows));
                                    } else {
                                        res.send(JSON.stringify(false));
                                    }
                                }
                            });
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                });
            }
        });
        router.get("/getlocations", (req, res) => {
            database.query("SELECT loc_id, loc_name, address, lat, lng FROM locations", (err, rows) => {
                if (err) {
                    console.log(err);
                    res.send(JSON.stringify(false));
                } else {
                    if (rows.length > 0) {
                        var i = 0;
                        asyncWhile(() => {
                            return i < rows.length;
                        }, (next, callback) => {
                            database.query("SELECT * FROM checkin WHERE loc_id = ? AND date_time BETWEEN DATE_ADD(CURRENT_TIMESTAMP, INTERVAL -7 DAY) AND CURRENT_TIMESTAMP", rows[i]['loc_id'], (err, checkin_rows) => {
                                if (err) {
                                    callback(err);
                                } else {
                                    rows[i]['checkins'] = checkin_rows.length;
                                    i++;
                                    next();
                                }
                            });
                        }, (err) => {
                            if (err) {
                                console.log(err);
                                res.send(JSON.stringify(false));
                            } else {
                                res.send(JSON.stringify(rows));
                            }
                        }
                        );
                    } else {
                        res.send(JSON.stringify(false));
                    }
                }
            });
        });
        router.post("/getlocation", (req, res) => {
            if (req.body.loc_id) {
                checkSession(req, res, (err, user) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (user['permissions'] == 2) {
                            //Somehow return ADDRESS from 'lat' & 'lng' columns too?
                            //Returns to search_location.js
                            if (req.body.loc_id.replace(/[^a-zA-Z0-9]+/g, '') == req.body.loc_id) {
                                database.query("SELECT loc_name, address FROM locations WHERE loc_id = ?", req.body.loc_id.replace(/[^a-zA-Z0-9]+/g, ''), (err, rows) => {
                                    if (err) {
                                        console.log(err);
                                        res.send(JSON.stringify(false));
                                    } else {
                                        if (rows.length > 0) {
                                            res.send(JSON.stringify(rows[0]));
                                        } else {
                                            res.send(JSON.stringify(false));

                                        }
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(false));
                            }
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                })
            } else {
                res.send(JSON.parse(false));
            }
        });
        router.get("/signout", (req, res) => {
            database.query("DELETE FROM sessions WHERE session_id = ?", req.session.session_id, (err, rows) => {
                res.clearCookie('session_auth');
                req.session.session_id = null;
                res.send(JSON.stringify(true));
            });
        });
        router.post("/signin", (req, res) => {
            if (req.body.email && req.body.password) {
                var email = req.body.email.replace(/[^a-zA-Z0-9@.]+/g, '');
                var password = req.body.password.replace(/[^a-zA-Z0-9]+/g, '');
                database.query("SELECT * FROM users WHERE email = ?", email, (err, rows) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        if (rows.length > 0) {
                            var passwordHash = crypto.createHash('sha256').update(password).digest('hex');
                            if (passwordHash == rows[0].password) {
                                var unique = false;
                                var session_id = "";
                                asyncWhile(() => {
                                    return !unique;
                                }, (next, callback) => {
                                    database.query("SELECT session_id FROM sessions WHERE session_id = ?", session_id, (err, rows) => {
                                        if (err) {
                                            callback(err);
                                        } else {
                                            if (rows.length < 1) {
                                                unique = true;
                                            } else {
                                                session_id = Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 7);
                                            }
                                            next();
                                        }
                                    });
                                }, (err) => {
                                   if (err) {
                                        console.log(err);
                                        res.send(JSON.stringify(false));
                                   } else {
                                        database.query("INSERT INTO sessions (user_id, session_id) VALUES (?, ?)", [rows[0].user_id, session_id], (err, rows) => {
                                            if (err) {
                                                console.log(err);
                                                res.send(JSON.stringify(false));
                                            } else {
                                                res.cookie('session_auth', session_id, {
                                                    maxAge: 900000000,
                                                    httpOnly: true,
                                                });
                                                req.session.session_id = session_id;
                                                req.session.save();
                                                res.send(JSON.stringify(true));
                                            }
                                        });
                                    }
                                });
                            } else {
                                res.send(JSON.stringify(false));
                            }
                        } else {
                            res.send(JSON.stringify(false));
                        }
                    }
                });
            } else {
                res.send(JSON.stringify(false));
            }
        });
        router.post("/signup", (req, res) => {
            if (req.body.email && req.body.password && req.body.given_name && req.body.family_name) {
                var given_name = req.body.given_name.replace(/[^a-zA-Z0-9]+/g, '');
                var family_name = req.body.family_name.replace(/[^a-zA-Z0-9]+/g, '');
                var email = req.body.email.replace(/[^a-zA-Z0-9@.]+/g, '');
                var password = req.body.password.replace(/[^a-zA-Z0-9]+/g, '');
                var response = {
                    given_name: (given_name == req.body.given_name && given_name != ""),
                    family_name: (family_name == req.body.family_name && family_name != ""),
                    email: (email == req.body.email && email != ""),
                    password: (password == req.body.password && req.body.password != "" && password.length > 7),
                };
                database.query("SELECT email FROM users WHERE email = ?", email, (err, rows) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(response));
                    } else {
                        if (rows.length > 0) {
                            response['email'] = false;
                            res.send(JSON.stringify(response));
                        } else {
                            validateEmail(email, (mailres) => {
                                if (!mailres['valid']) {
                                    response['email'] = false;
                                    res.send(JSON.stringify(response));
                                } else {
                                    if (response['given_name'] && response['family_name'] && response['email'] && response['password']) {
                                        var user_id = Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 7);
                                        var unique = false;
                                        asyncWhile(() => {
                                            return !unique;
                                        }, (next, callback) => {
                                            database.query("SELECT user_id FROM users WHERE user_id = ?", user_id, (err, rows) => {
                                                if (err) {
                                                    callback(err);
                                                } else {
                                                    if (rows.length < 1) {
                                                        unique = true;
                                                    } else {
                                                        user_id = Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 7);
                                                    }
                                                    next();
                                                }
                                            });
                                        }, (err) => {
                                            if (err) {
                                                console.log(err);
                                                res.send(JSON.stringify(response));
                                            } else {
                                                var passwordHash = crypto.createHash('sha256').update(password).digest('hex');
                                                database.query("INSERT INTO users (user_id, given_name, family_name, email, password) VALUES (?, ?, ?, ?, ?)", [user_id, given_name, family_name, email, passwordHash], (err, rows) => {
                                                    if (err) {
                                                        console.log(err);
                                                        res.send(JSON.stringify(response));
                                                    } else {
                                                        res.send(JSON.stringify(response));
                                                    }
                                                });
                                            }
                                        });
                                    } else {
                                        res.send(JSON.stringify(response));
                                    }
                                }
                            });
                        }
                    }
                })
            } else {
                res.send(JSON.stringify(false));
            }
        });
        router.post("/googlesignin", (req, res) => {
            if (req.body.idtoken) {
                var token = req.body.idtoken;
                verifyAuth(token, (err, payload) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                    } else {
                        var user = {
                            user_id: Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 7),
                            social_id: payload['sub'],
                            given_name: payload['given_name'],
                            family_name: payload['family_name'],
                            email: payload['email'],
                            session_id: Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 7),
                        };
                        database.query("SELECT * FROM users WHERE social_id = ?", user['social_id'], (err, rows) => {
                            if (err) {
                                console.log(err);
                                res.send(JSON.stringify(false));
                            } else {
                                if (rows.length > 0) {
                                    var unique = false;
                                    asyncWhile(() => {
                                        return !unique;
                                    }, (next, callback) => {
                                        database.query("SELECT session_id FROM sessions WHERE session_id = ?", user['session_id'], (err, rows) => {
                                            if (err) {
                                                callback(err);
                                            } else {
                                                if (rows.length < 1) {
                                                    unique = true;
                                                } else {
                                                    user['session_id'] = Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 7);
                                                }
                                                next();
                                            }
                                        });
                                    }, (err) => {
                                       if (err) {
                                            console.log(err);
                                            res.send(JSON.stringify(false));
                                       } else {
                                            database.query("INSERT INTO sessions (user_id, session_id) VALUES (?, ?)", [rows[0].user_id, user['session_id']], (err, rows) => {
                                                if (err) {
                                                    console.log(err);
                                                    res.send(JSON.stringify(false));
                                                } else {
                                                    res.cookie('session_auth', user['session_id'], {
                                                        maxAge: 900000000,
                                                        httpOnly: true,
                                                    });
                                                    req.session.session_id = user['session_id'];
                                                    req.session.save();
                                                    res.send(JSON.stringify(true));
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    database.query("SELECT email FROM users WHERE email = ?", payload['email'], (err, rows) => {
                                        if (err) {
                                            console.log(err);
                                            res.send(JSON.stringify(false));
                                        } else {
                                            if (rows.length < 1) {
                                                var unique = false;
                                                asyncWhile(() => {
                                                    return !unique;
                                                }, (next, callback) => {
                                                    database.query("SELECT user_id FROM users WHERE user_id = ?", user['user_id'], (err, rows) => {
                                                        if (err) {
                                                            callback(err);
                                                        } else {
                                                            if (rows.length < 1) {
                                                                unique = true;
                                                            } else {
                                                                user['user_id'] = Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 7);
                                                            }
                                                            next();
                                                        }
                                                    });
                                                }, (err) => {
                                                    if (err) {
                                                        console.log(err);
                                                        res.send(JSON.stringify(false));
                                                    } else {
                                                        database.query("INSERT INTO users (user_id, social_id, given_name, family_name, email) VALUES (?, ?, ?, ?, ?)", [user['user_id'], user['social_id'], user['given_name'], user['family_name'], user['email']], (err, rows) => {
                                                            if (err) {
                                                                console.log(err);
                                                                res.send(JSON.stringify(false));
                                                            } else {
                                                                unique = false;
                                                                asyncWhile(() => {
                                                                    return !unique;
                                                                }, (next, callback) => {
                                                                    database.query("SELECT session_id FROM sessions WHERE session_id = ?", user['session_id'], (err, rows) => {
                                                                        if (err) {
                                                                            callback(err);
                                                                        } else {
                                                                            if (rows.length < 1) {
                                                                                unique = true;
                                                                            } else {
                                                                                user['session_id'] = Math.random().toString(36).replace(/[^a-zA-Z0-9]+/g, '').substr(0, 7);
                                                                            }
                                                                            next();
                                                                        }
                                                                    });
                                                                }, (err) => {
                                                                   if (err) {
                                                                        console.log(err);
                                                                        res.send(JSON.stringify(false));
                                                                   } else {
                                                                        database.query("INSERT INTO sessions (user_id, session_id) VALUES (?, ?)", [user['user_id'], user['session_id']], (err, rows) => {
                                                                            if (err) {
                                                                                console.log(err);
                                                                                res.send(JSON.stringify(false));
                                                                            } else {
                                                                                res.cookie('session_auth', user['session_id'], {
                                                                                    maxAge: 900000000,
                                                                                    httpOnly: true,
                                                                                });
                                                                                req.session.session_id = user['session_id'];
                                                                                req.session.save();
                                                                                res.send(JSON.stringify(true));
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            } else {
                                                res.send(JSON.stringify(false));
                                            }
                                        }
                                    });
                                }
                            }
                        });
                    }
                });
            } else {
                res.send(JSON.stringify(false));
            }
        });
        router.post("/search", (req, res) => {
            if (req.body.query) {
                var query = req.body.query;
                // Search users
                database.query("SELECT given_name,family_name,user_id FROM users WHERE given_name LIKE CONCAT('%', ?, '%') OR family_name LIKE CONCAT('%', ?, '%') OR user_id LIKE CONCAT('%', ?, '%')", [query, query, query], (err, rows_user) => {
                    if (err) {
                        console.log(err);
                        res.send(JSON.stringify(false));
                        res.end();
                    } else {
                        // Search venues
                        database.query("SELECT loc_id,loc_name FROM locations WHERE loc_id LIKE CONCAT('%', ?, '%') OR loc_name LIKE CONCAT('%', ?, '%')", [query, query], (err, rows_venue) => {
                            if (err) {
                                console.log(err);
                                res.send(JSON.stringify(false));
                                res.end();
                            } else {
                                if (rows_user.length < 1 && rows_venue.length < 1) {
                                    res.send(JSON.stringify(false));
                                } else {
                                    // Return combined array
                                    var data = {
                                        userArray: rows_user,
                                        venueArray: rows_venue,
                                    };
                                    res.send(JSON.stringify(data));
                                }
                            }
                        });
                    }
                });
            } else {
                res.send(JSON.stringify(false));
            }
        });
    }
});

module.exports = {
    router: router,
    database: database,
    checkSession: checkSession,
};