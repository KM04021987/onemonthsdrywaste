import receiverregisterService from "./../services/receiverregisterService";
import { validationResult } from "express-validator";

let getPageRegister = (req, res) => {
    console.log('receiverregisterController: getPageRegister')
    return res.render("receiverregister.ejs", {
        errors: req.flash("errors")
    });
};

let createNewUser = async (req, res) => {
    console.log('receiverregisterController: createNewUser')
    //validate required fields
    let errorsArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/rregister");
    }

    //create a new user
    let newUser = {
        fullname: req.body.fullName,
        phone: req.body.phone,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        pin: req.body.pin,
        address: req.body.address,
        password: req.body.password
    };
    try {
        await receiverregisterService.createNewUser(newUser);
        return res.redirect("/rlogin");
    } catch (err) {
        req.flash("errors", err);
        return res.redirect("/rregister");
    }
};
module.exports = {
    getPageRegister: getPageRegister,
    createNewUser: createNewUser
};