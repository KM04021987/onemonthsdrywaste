import express from "express";
import homePageController from "../controllers/homePageController"
import aboutPageController from "../controllers/aboutPageController"
import recyclableitemsPageController from "../controllers/recyclableitemsPageController"
import stepstofollowPageController from "../controllers/stepstofollowPageController"
import privacyPageController from "../controllers/privacyPageController"
import faqPageController from "../controllers/faqPageController"
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
    router.get("/about", aboutPageController.getAboutPage);
    router.get("/recyclableitems", recyclableitemsPageController.getRecyclableitemsPage);
    router.get("/stepstofollow", stepstofollowPageController.getStepstofollowPage);
    router.get("/privacy", privacyPageController.getPrivacyPage);
    router.get("/faq", faqPageController.getFaqPage);
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

    router.get("/dregister", donorregisterController.getPageRegister);
    router.get("/rregister", receiverregisterController.getPageRegister);
    router.post("/dregister", auth.validateRegister, donorregisterController.createNewUser);
    router.post("/rregister", auth.validateRegister, receiverregisterController.createNewUser);
    router.post("/logout", donorloginController.postLogOut);
    router.post("/logout", receiverloginController.postLogOut);
    router.post("/dprofile", donorProfileController.createPickupRequest);
    router.get("/dprofile", donorProfileController.handleDonorPage);
    router.get("/rprofile", receiverProfileController.handleReceiverPage);

    router.get('/get-edit-pickup/:id', donorProfileController.getEditPickup);
    router.put('/put-edit-pickup', donorProfileController.putEditPickup);
    router.delete('/delete-pickup', donorProfileController.deletePickupById);
    router.post('/list-of-receivers', donorProfileController.getReceiverList);

    router.get("/search-pickup", receiverProfileController.getSearchPickup);
    
    return app.use("/", router);
};

module.exports = initWebRoutes;