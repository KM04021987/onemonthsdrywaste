import { validationResult } from "express-validator";
import donorloginService from "../services/donorloginService";


let getPageLogin = (req, res) => {
    console.log('donorloginController: getPageLogin')
    return res.render("donorlogin.ejs", {
        errors: req.flash("errors")
    });
};

let handleLogin = async (req, res) => {
    console.log('donorloginController: handleLogin')
    let errorsArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/dlogin");
    }

    try {
        await donorloginService.handleLogin(req.body.phone, req.body.password);
        return res.redirect("/");
    } catch (err) {
        req.flash("errors", err);
        return res.redirect("/dlogin");
    }
};

let checkLoggedIn = (req, res, next) => {
    console.log('donorloginController: checkLoggedIn')
    if (!req.isAuthenticated()) {
        return res.redirect("/dlogin");
    }
    next();
};

let checkLoggedOut = (req, res, next) => {
    console.log('donorloginController: checkLoggedOut')
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
};

let postLogOut = (req, res) => {
    console.log('donorloginController: postLogOut')
    req.session.destroy(function(err) {
        return res.redirect("/");
    });
};


module.exports = {
    getPageLogin: getPageLogin,
    handleLogin: handleLogin,
    checkLoggedIn: checkLoggedIn,
    checkLoggedOut: checkLoggedOut,
    postLogOut: postLogOut
};