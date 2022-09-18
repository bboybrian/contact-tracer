var express = require('express');
var checkSession = require('../database').checkSession;
const path = require('path');
var fs = require('fs');
var router = express.Router();
var url = require('url');

router.get('/', (req, res, next) => {
    checkSession(req, res, (err, user) => {
        if (err) {
            console.log(err);
            res.sendStatus(404);
            res.end();
        } else {
            if (user['valid']) {
                if (user['permissions'] == 2) {
                    res.sendFile(path.join(__dirname, "../public", "admin/index.html"));
                } else {
                    next();
                }
            } else {
                next();
            }
        }
    });
});

router.get('/:filename.html', (req, res, next) => {
    checkSession(req, res, (err, user) => {
        if (err) {
            console.log(err);
            res.sendStatus(404);
            res.end();
        } else {
            if (req.params.filename != "map" && req.params.filename != "header") {
                if (user['permissions'] == 2) {
                    if (fs.existsSync(path.join(__dirname, "../public", "admin", req.params.filename + ".html"))) {
                        res.sendFile(path.join(__dirname, "../public", "admin", req.params.filename + ".html"));
                        return;
                    }
                }
                if (req.params.filename != "login" && req.params.filename != "signup") {
                    if (user['valid']) {
                        next();
                        return;
                    } else {
                        var rawUrl = url.parse(req.url);
                        var uri = rawUrl.search ? encodeURIComponent(rawUrl.search) : "";

                        res.writeHead(301, {
                            Location: "/login.html?callback=" + req.params.filename + ".html" + uri,
                        });
                        res.end();
                        return;
                    }
                } else {
                    if (user['valid']) {
                        res.writeHead(301, {
                            Location: "/"
                        });
                        res.end();
                        return;
                    } else {
                        next();
                        return;
                    }
                }
            } else {
                if (user['permissions'] == 2) {
                    if (fs.existsSync(path.join(__dirname, "../public", "admin", req.params.filename + ".html"))) {
                        res.sendFile(path.join(__dirname, "../public", "admin", req.params.filename + ".html"));
                        return;
                    } else {
                        next();
                    }
                } else {
                    next();
                }
            }
        }
    });
});

module.exports = router;