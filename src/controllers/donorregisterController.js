import donorregisterService from "./../services/donorregisterService";
import { validationResult } from "express-validator";

let getPageRegister = (req, res) => {
    console.log('donorregisterController: getPageRegister')
    return res.render("donorregister.ejs", {
        errors: req.flash("errors")
    });
};

let createNewUser = async (req, res) => {
    console.log('donorregisterController: createNewUser')
    //validate required fields
    let errorsArr = [];
    let validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
        let errors = Object.values(validationErrors.mapped());
        errors.forEach((item) => {
            errorsArr.push(item.msg);
        });
        req.flash("errors", errorsArr);
        return res.redirect("/dregister");
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
        await donorregisterService.createNewUser(newUser);
        return res.redirect("/dlogin");
    } catch (err) {
        req.flash("errors", err);
        return res.redirect("/dregister");
    }
};
module.exports = {
    getPageRegister: getPageRegister,
    createNewUser: createNewUser
};