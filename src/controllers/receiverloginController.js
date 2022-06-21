import { validationResult } from "express-validator";
import receiverloginService from "../services/receiverloginService";


let getPageLogin = (req, res) => {
    console.log('receiverloginController: getPageLogin')
    return res.render("receiverlogin.ejs", {
        errors: req.flash("errors")
    });
};

let handleLogin = async (req, res) => {
    console.log('receiverloginController: handleLogin')
    let errorsArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/rlogin");
    }

    try {
        await receiverloginService.handleLogin(req.body.phone, req.body.password);
        return res.redirect("/");
    } catch (err) {
        req.flash("errors", err);
        return res.redirect("/rlogin");
    }
};

let checkLoggedIn = (req, res, next) => {
    console.log('receiverloginController: checkLoggedIn')
    if (!req.isAuthenticated()) {
        return res.redirect("/rlogin");
    }
    next();
};

let checkLoggedOut = (req, res, next) => {
    console.log('receiverloginController: checkLoggedOut')
    if (req.isAuthenticated()) {
        return res.redirect("/");
    }
    next();
};

let postLogOut = (req, res) => {
    console.log('receiverloginController: postLogOut')
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