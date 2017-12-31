const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const router = express.Router();

// Load User model
require("../models/User");
const User = mongoose.model("users");

// User Login route
router.get("/login", async(req, res) => {
    res.render("users/login");
});

// User register route
router.get("/register", async(req, res) => {
    res.render("users/register");
});

router.post("/login", (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/ideas',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});

router.post("/register", (req, res) => {
    let err = [];

    if (req.body.password !== req.body.password2) {
        err.push({
            text: "Password do not match"
        });
    }

    if (req.body.password.length < 4) {
        err.push({
            text: "Password must be at least 4 characters"
        });
    }

    if (err.length) {
        res.render("users/register", {
            errors: err,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    } else {
        User.findOne({
            email: req.body.email
        }).then(user => {
            if (user) {
                req.flash('error_msg', 'Email already registered');
                res.redirect('/users/register');
            } else {
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    password: req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in');
                                res.redirect('/users/login');
                            })
                            .catch(err => {
                                console.log(err);
                                return;
                            })
                    })
                })
            }
        });
    }
});

// User logout route
router.get("/logout", (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;