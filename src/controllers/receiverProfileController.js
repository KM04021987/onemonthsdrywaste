import pickuprequestService from "./../services/pickuprequestService";

let handleReceiverPage = async (req, res) => {
    console.log('receiverProfileController: handleReceiverPage')
    const jsonData = JSON.stringify(req.user)
    const jsonParseObj = JSON.parse(jsonData)
    const jsonaccount = jsonParseObj.ACCOUNT
    const jsonfullname = jsonParseObj.FULLNAME
    const jsonphone_no = jsonParseObj.PHONE_NO
    const jsoncountry = jsonParseObj.COUNTRY
    const jsonstate = jsonParseObj.STATE
    const jsoncity = jsonParseObj.CITY
    const jsonpin_or_zip = jsonParseObj.PIN_OR_ZIP
    const jsonaddress = jsonParseObj.ADDRESS
    return res.render("receiverprofile.ejs",{
        account: jsonaccount,
        fullname: jsonfullname,
        phone: jsonphone_no,
        country: jsoncountry,
        state: jsonstate,
        city: jsoncity,
        pin: jsonpin_or_zip,
        address: jsonaddress
    });
};

let getSearchPickupForm = async (req, res) => {
    console.log('receiverProfileController: getSearchPickupForm')
    const receiveraccount = req.params.id
    return res.render("searchpickup.ejs", {
        receiveraccount: receiveraccount
    })
}

let showListOfPickup = async (req, res) => {
    console.log('receiverProfileController: showListOfPickup')

    const receiveraccount = req.params.id
    
    const RECEIVER_COUNTRY = req.body.country
    const RECEIVER_STATE = req.body.state
    const RECEIVER_PIN_OR_ZIP = req.body.pin

    pickuprequestService.getPickupList(RECEIVER_COUNTRY, RECEIVER_STATE, RECEIVER_PIN_OR_ZIP).then((data) => {
    return res.render("showpickup.ejs", {
        userData: data,
        receiveraccount: receiveraccount,
        country: RECEIVER_COUNTRY,
        state: RECEIVER_STATE,
        pin: RECEIVER_PIN_OR_ZIP
    })
    }).catch(error => {
    console.log('error while finding pickup request info')
    }); 
};

let sendMessage = async (req, res) => {
    console.log('receiverProfileController: sendMessage')
    const receiveraccount = req.params.id
    const donoraccount = req.body.donoraccount
    const messageContent = req.body.messageContent
    const RECEIVER_COUNTRY = req.body.country
    const RECEIVER_STATE = req.body.state
    const RECEIVER_PIN_OR_ZIP = req.body.pin
    await pickuprequestService.saveReceiversMessage(donoraccount, receiveraccount, messageContent).then(() => {
        pickuprequestService.getPickupList(RECEIVER_COUNTRY, RECEIVER_STATE, RECEIVER_PIN_OR_ZIP).then((data) => {
            return res.render("showpickup.ejs", {
                userData: data,
                receiveraccount: receiveraccount,
                country: RECEIVER_COUNTRY,
                state: RECEIVER_STATE,
                pin: RECEIVER_PIN_OR_ZIP
            })
        }).catch(error => {
            console.log("error while fetching pickup requests")
        });
    }).catch(error => {
        console.log("error while saving the receiver's message")
    });
}


module.exports = {
    handleReceiverPage: handleReceiverPage,
    getSearchPickupForm: getSearchPickupForm,
    showListOfPickup: showListOfPickup,
    sendMessage: sendMessage
};