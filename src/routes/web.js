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
    //router.post("/dprofile", donorProfileController.createPickupRequest);
    router.get("/get-request-a-new-pickup-form/:id", donorProfileController.getRequestANewPickupForm);
    router.post("/post-new-pickup-request/:id", donorProfileController.uploadImage.single('uploaded_image'), donorProfileController.postNewPickupRequest);

    router.get("/get-requests-history/:id", donorProfileController.getRequestsHistory);
    router.get('/get-edit-pickup/:id', donorProfileController.getEditPickup);
    router.post('/put-edit-pickup/:id', donorProfileController.uploadImage.single('uploaded_image'), donorProfileController.putEditPickup);
    router.get('/delete-pickup/:id', donorProfileController.deletePickupById);

    router.get('/get-search-receivers-form/:id', donorProfileController.getSearchReceiversForm);
    router.post('/show-list-of-receivers/:id', donorProfileController.showListOfReceivers);
    router.post('/send-message-to-receiver/:id', donorProfileController.sendMessageToReceiver);

    router.get('/get-donor-chat-history-list/:id', donorProfileController.getDonorChatHistoryList);
    router.post('/show-donor-chat-history/:id', donorProfileController.showDonorChatHistory);
    router.get('/show-donor-chat-history/:id', donorProfileController.refreshDonorRealtime);
    router.get('/send-message-realtime-to-receiver/:id', donorProfileController.refreshDonorRealtime);    
    router.post('/send-message-realtime-to-receiver/:id', donorProfileController.sendMessageRealtimeToReceiver);
/*Donor's after login - Ends*/

/*Receiver's after login - Starts*/
    router.get('/get-search-pickup-form/:id', receiverProfileController.getSearchPickupForm);
    router.post('/show-list-of-pickup/:id', receiverProfileController.showListOfPickup);
    router.post('/send-message-to-pickup-request/:id', receiverProfileController.sendMessage);

    router.get('/get-search-donors-form/:id', receiverProfileController.getSearchDonorsForm);
    router.post('/show-list-of-donors/:id', receiverProfileController.showListOfDonors);
    router.post('/send-message-to-donor/:id', receiverProfileController.sendMessageToDonor);

    router.get('/get-receiver-chat-history-list/:id', receiverProfileController.getReceiverChatHistoryList);
    router.post('/show-receiver-chat-history/:id', receiverProfileController.showReceiverChatHistory);
    router.get('/show-receiver-chat-history/:id', receiverProfileController.refreshReceiverRealtime);
    router.get('/send-message-realtime-to-donor/:id', receiverProfileController.refreshReceiverRealtime);    
    router.post('/send-message-realtime-to-donor/:id', receiverProfileController.sendMessageRealtimeToDonor);
/*Receiver's after login - Ends*/

/*Logout Starts*/
    router.post("/dlogout", donorloginController.postLogOut);
    router.post("/rlogout", receiverloginController.postLogOut);
/*Logout Ends*/

    return app.use("/", router);
};

module.exports = initWebRoutes;