import pickuprequestService from "./../services/pickuprequestService";
import messageinfoService from "./../services/messageinfoService";
import receiverloginService from "./../services/receiverloginService";

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

    receiverloginService.findUserByPhone(jsonphone_no).then(async (receiveruser) => {
        if (!receiveruser) {
            return res.render("receiverprofilenotcorrect.ejs")
        }
        else {
            return res.render("receiverprofile.ejs",{
                receiveraccount: jsonaccount,
                fullname: jsonfullname,
                phone: jsonphone_no,
                country: jsoncountry,
                state: jsonstate,
                city: jsoncity,
                pin: jsonpin_or_zip,
                address: jsonaddress
            });
        }
    })
};

let getSearchPickupForm = async (req, res) => {
    console.log('receiverProfileController: getSearchPickupForm')
    const receiveraccount = req.params.id
    return res.render("receiversearchpickup.ejs", {
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
    return res.render("receivershowpickup.ejs", {
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
    const receiveraccount = req.body.receiveraccount
    const donoraccount = req.body.donoraccount
    const messageContent = req.body.messageContent
    const RECEIVER_COUNTRY = req.body.country
    const RECEIVER_STATE = req.body.state
    const RECEIVER_PIN_OR_ZIP = req.body.pin
    await messageinfoService.saveReceiversMessage(donoraccount, receiveraccount, messageContent).then(() => {
        pickuprequestService.getPickupList(RECEIVER_COUNTRY, RECEIVER_STATE, RECEIVER_PIN_OR_ZIP).then((data) => {
            return res.render("receivershowpickup.ejs", {
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


let getSearchDonorsForm = async (req, res) => {
    console.log('receiverProfileController: getSearchDonorsForm')
    const receiveraccount = req.params.id
    return res.render("receiversearchdonorsnearme.ejs", {
        receiveraccount: receiveraccount
    })
}


let showListOfDonors = async (req, res) => {
    console.log('receiverProfileController: showListOfDonors')
    let receiveraccount = req.params.id
    let findByInfo = {
        country: req.body.country,
        state: req.body.state,
        pin: req.body.pin
    };
    await pickuprequestService.getDonorList(findByInfo).then((data) => {
    return res.render("receiverlistofdonors.ejs", {
        userData: data,
        receiveraccount: receiveraccount,
        country: req.body.country,
        state: req.body.state,
        pin: req.body.pin
    })
    }).catch(error => {
    console.log('error while finding donor info')
    });
};

let sendMessageToDonor = async (req, res) => {
    console.log('receiverProfileController: sendMessageToDonor')
    const receiveraccount = req.body.receiveraccount
    const donoraccount = req.body.donoraccount
    const messageContent = req.body.messageContent

    await messageinfoService.saveReceiversMessage(donoraccount, receiveraccount, messageContent).then(() => {
        let findByInfo = {
            country: req.body.country,
            state: req.body.state,
            pin: req.body.pin
        };
        pickuprequestService.getDonorList(findByInfo).then((data) => {
            return res.render("receiverlistofdonors.ejs", {
                userData: data,
                receiveraccount: receiveraccount,
                country: req.body.country,
                state: req.body.state,
                pin: req.body.pin
            })
        }).catch(error => {
            console.log("error while fetching donor's information")
        });
    }).catch(error => {
        console.log("error while saving the receiver's message")
    });
}

let getReceiverChatHistoryList = async (req, res) => {
    console.log('receiverProfileController: getReceiverChatHistoryList')
    let receiveraccount = req.params.id

    messageinfoService.getChatListOfReceiver(receiveraccount).then((data) => {
    return res.render("receiverchathistorylist.ejs", {
        userData: data,
        receiveraccount: receiveraccount
    })
    }).catch(error => {
    console.log("error while finding Receiver's Chat History")
    });
};

let showReceiverChatHistory = async (req, res) => {
    console.log('receiverProfileController: showReceiverChatHistory')
    const receiveraccount = req.body.receiveraccount
    const donoraccount = req.params.id
    const fullname = req.body.fullname

    await messageinfoService.getReceiverChatHistory(donoraccount, receiveraccount).then((data) => {
    return res.render("receiverchatdetails.ejs", {
        userData: data,
        donoraccount: donoraccount,
        receiveraccount: receiveraccount,
        fullname: fullname
    })
    }).catch(error => {
    console.log('error while finding Receiver Chat Details')
    });
};

let sendMessageRealtimeToDonor = async (req, res) => {
    console.log('receiverProfileController: sendMessageRealtimeToDonor')
    const donoraccount = req.params.id
    const receiveraccount = req.body.receiveraccount
    const messageContent = req.body.messageContent
    const fullname = req.body.fullname

    await messageinfoService.saveReceiversMessage(donoraccount, receiveraccount, messageContent).then(() => {
        messageinfoService.getReceiverChatHistory(donoraccount, receiveraccount).then((data) => {
            return res.render("receiverchatdetails.ejs", {
                userData: data,
                donoraccount: donoraccount,
                receiveraccount: receiveraccount,
                fullname: fullname
            })
            }).catch(error => {
            console.log('error while finding Receiver Chat Details')
            });
    }).catch(error => {
        console.log("error while saving the receiver's message")
    });
}

let refreshReceiverRealtime = async (req, res) => {
    console.log('receiverProfileController: refreshReceiverRealtime')
    const jsonData = JSON.stringify(req.user)
    const jsonParseObj = JSON.parse(jsonData)
    const jsonaccount = jsonParseObj.ACCOUNT
    const receiveraccount = jsonaccount
    const donoraccount = req.params.id
    
    await messageinfoService.getReceiverChatHistory(donoraccount, receiveraccount).then((data) => {
    return res.render("receiverrefreshmessage.ejs", {
        userData: data,
        donoraccount: donoraccount,
        receiveraccount: receiveraccount
    })
    }).catch(error => {
    console.log('error while finding Receiver Chat Details')
    });
}


module.exports = {
    handleReceiverPage: handleReceiverPage,
    getSearchPickupForm: getSearchPickupForm,
    showListOfPickup: showListOfPickup,
    sendMessage: sendMessage,
    getSearchDonorsForm: getSearchDonorsForm,
    showListOfDonors: showListOfDonors,
    sendMessageToDonor: sendMessageToDonor,
    getReceiverChatHistoryList: getReceiverChatHistoryList,
    showReceiverChatHistory: showReceiverChatHistory,
    sendMessageRealtimeToDonor: sendMessageRealtimeToDonor,
    refreshReceiverRealtime: refreshReceiverRealtime
};