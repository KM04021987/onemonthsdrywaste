import express from "express";
import homePageController from "../controllers/homePageController"
import donorProfileController from "../controllers/donorProfileController";
import receiverProfileController from "../controllers/receiverProfileController";
import donorregisterController from "../controllers/donorregisterController";
import receiverregisterController from "../controllers/receiverregisterController";
import donorloginController from "../controllers/donorloginController";
import receiverloginController from "../controllers/receiverloginController";
import auth from "../validation/authValidation";
import passport from "passport";
import initPassportLocal from "../controllers/passportLocalController";

// Init all passport
initPassportLocal();

let router = express.Router();

let initWebRoutes = (app) => {
    router.get("/", homePageController.getHomePage);
/*Home Page - Starts*/
    router.get("/about", homePageController.getAboutPage);
    router.get("/recyclableitems", homePageController.getRecyclableitemsPage);
    router.get("/stepstofollow", homePageController.getStepstofollowPage);
    router.get("/privacy", homePageController.getPrivacyPage);
    router.get("/faq", homePageController.getFaqPage);
/*Home Page - Ends*/

/*Register Starts*/
    router.get("/dregister", donorregisterController.getPageRegister);
    router.get("/rregister", receiverregisterController.getPageRegister);
    router.post("/dregister", auth.validateRegister, donorregisterController.createNewUser);
    router.post("/rregister", auth.validateRegister, receiverregisterController.createNewUser);
/*Register Ends*/

/*Login Authentication - Starts*/
    router.get("/donorlogin.ejs", donorloginController.checkLoggedIn, donorProfileController.handleDonorPage);
    router.get("/receiverlogin.ejs", receiverloginController.checkLoggedIn, receiverProfileController.handleReceiverPage);
    router.get("/dlogin",donorloginController.checkLoggedOut, donorloginController.getPageLogin);
    router.get("/rlogin",receiverloginController.checkLoggedOut, receiverloginController.getPageLogin);

    router.post("/dlogin", passport.authenticate("local", {
        successRedirect: "/dprofile",
        failureRedirect: "/dlogin",
        successFlash: true,
        failureFlash: true
    }));

    router.post("/rlogin", passport.authenticate("local", {
        successRedirect: "/rprofile",
        failureRedirect: "/rlogin",
        successFlash: true,
        failureFlash: true
    }));

    router.get("/dprofile", donorProfileController.handleDonorPage);
    router.get("/rprofile", receiverProfileController.handleReceiverPage);
/*Login Authentication - Ends*/

/*Donor's after login - Starts*/
    router.post("/dprofile", donorProfileController.createPickupRequest);
    
    router.get('/get-edit-pickup/:id', donorProfileController.getEditPickup);
    router.put('/put-edit-pickup', donorProfileController.putEditPickup);
    router.delete('/delete-pickup', donorProfileController.deletePickupById);
    router.post('/list-of-receivers', donorProfileController.getReceiverList);
/*Donor's after login - Ends*/

/*Receiver's after login - Starts*/
    router.get('/get-search-pickup-form/:id', receiverProfileController.getSearchPickupForm);
    router.post('/show-list-of-pickup/:id', receiverProfileController.showListOfPickup);
    router.post('/send-message/:id', receiverProfileController.sendMessage);
/*Receiver's after login - Ends*/

/*Logout Starts*/
    router.post("/logout", donorloginController.postLogOut);
    router.post("/logout", receiverloginController.postLogOut);
/*Logout Ends*/

    return app.use("/", router);
};

module.exports = initWebRoutes;