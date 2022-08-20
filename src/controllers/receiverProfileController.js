import pickuprequestService from "./../services/pickuprequestService";
import messageinfoService from "./../services/messageinfoService";
import receiverloginService from "./../services/receiverloginService";
import receiverregisterService from "./../services/receiverregisterService";

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

let getReceiverEditProfile = async (req, res) => {
    console.log('receiverProfileController: getReceiverEditProfile')
    const receiveraccount = req.params.id

    await receiverloginService.findUserByAccount(receiveraccount).then((profile) => {
        const jsonData = JSON.stringify(profile)
        const removebracket1 = jsonData.replace('[','')
        const removebracket2 = removebracket1.replace(']','')
        const jsonParseobj = JSON.parse(removebracket2)

        const fullname = jsonParseobj.FULLNAME
        const phone = jsonParseobj.PHONE_NO
        const country = jsonParseobj.COUNTRY
        const state = jsonParseobj.STATE
        const city = jsonParseobj.CITY
        const pin = jsonParseobj.PIN_OR_ZIP
        const address = jsonParseobj.ADDRESS

    return res.render("receivereditprofile.ejs", {
        receiveraccount: receiveraccount,
        fullname: fullname,
        phone: phone,
        country: country,
        state: state,
        city: city,
        pin: pin,
        address: address
    })
    }).catch(error => {
        console.log('error while fetching receiver profile for the receiver edit page')
    });
};

let postReceiverEditProfile = async (req, res) => {
    console.log('receiverProfileController: postReceiverEditProfile')

    //Update receiver's profile
    let updateReceiver = {
        receiveraccount: req.params.id,
        phone: req.body.phone,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        pin: req.body.pin,
        address: req.body.address
    };

    try {
        await receiverregisterService.updateReceiverProfile(updateReceiver);
        return res.redirect("/rprofile")
    } catch (err) {
        if (err == '') {
            return res.render("receiverprofilealert.ejs",{
                receiveraccount: updateReceiver.receiveraccount,
                message_header: "Error!!!",
                message_body: "Something is wrong. Error while updating the profile. "
            });
        }
        else {
            return res.render("receiverprofilealert.ejs",{
                receiveraccount: updateReceiver.receiveraccount,
                message_header: "Error!!!",
                message_body: err
            });
        }
    }
};

let getReceiverChangePassword = async (req, res) => {
    console.log('receiverProfileController: getReceiverChangePassword')
    const receiveraccount = req.params.id

    await receiverloginService.findUserByAccount(receiveraccount).then((profile) => {
        const jsonData = JSON.stringify(profile)
        const removebracket1 = jsonData.replace('[','')
        const removebracket2 = removebracket1.replace(']','')
        const jsonParseobj = JSON.parse(removebracket2)

        const fullname = jsonParseobj.FULLNAME
        const phone = jsonParseobj.PHONE_NO
        const country = jsonParseobj.COUNTRY
        const state = jsonParseobj.STATE
        const city = jsonParseobj.CITY
        const pin = jsonParseobj.PIN_OR_ZIP
        const address = jsonParseobj.ADDRESS

    return res.render("receiverchangepassword.ejs", {
        receiveraccount: receiveraccount,
        fullname: fullname,
        phone: phone,
        country: country,
        state: state,
        city: city,
        pin: pin,
        address: address
    })
    }).catch(error => {
        console.log('error while fetching receiver profile for the change password page')
    });
};

let postReceiverChangePassword = async (req, res) => {
    console.log('receiverProfileController: postReceiverChangePassword')
    const jsonData = JSON.stringify(req.user)
    const jsonParseObj = JSON.parse(jsonData)
    const savedPassword = jsonParseObj.PASSWORD

    //Update receiver's password
    let updatePassword = {
        receiveraccount: req.params.id,
        oldpassword: req.body.opassword,
        newpassword: req.body.password,
        passwordConfirmation: req.body.passwordConfirmation,
        savedPassword: savedPassword
    };

    try {
        await receiverregisterService.updateReceiverPassword(updatePassword);
        return res.redirect("/rprofile")
    } catch (err) {
        if (err == '') {
            return res.render("receiverprofilealert.ejs",{
                receiveraccount: updatePassword.receiveraccount,
                message_header: "Error!!!",
                message_body: "Something is wrong. Error while changing the password. "
            });
        }
        else {
            return res.render("receiverprofilealert.ejs",{
                receiveraccount: updatePassword.receiveraccount,
                message_header: "Error!!!",
                message_body: err
            });
        }
    }
};

let deleteProfile = async (req, res) => {
    console.log('receiverProfileController: deleteProfile')
    const receiveraccount = req.params.id
    
    await receiverregisterService.deleteProfile(receiveraccount).then(() => {
        req.session.destroy(function(err) {
            return res.redirect("/");
        });
    }).catch(error => {
        return res.render("receiverprofilealert.ejs",{
            donoraccount: receiveraccount,
            message_header: "Error!!!",
            message_body: "Something is wrong. Error while deleting the profile. "
        });
    });
};



let getSearchPickupForm = async (req, res) => {
    console.log('receiverProfileController: getSearchPickupForm')
    const receiveraccount = req.params.id
    const jsonData = JSON.stringify(req.user)
    const jsonParseObj = JSON.parse(jsonData)
    const country = jsonParseObj.COUNTRY
    const state = jsonParseObj.STATE
    const pin = jsonParseObj.PIN_OR_ZIP
    return res.render("receiversearchpickup.ejs", {
        receiveraccount: receiveraccount,
        receivercountry: country,
        receiverstate: state,
        receiverpin: pin
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
    const jsonData = JSON.stringify(req.user)
    const jsonParseObj = JSON.parse(jsonData)
    const country = jsonParseObj.COUNTRY
    const state = jsonParseObj.STATE
    const pin = jsonParseObj.PIN_OR_ZIP
    return res.render("receiversearchdonorsnearme.ejs", {
        receiveraccount: receiveraccount,
        receivercountry: country,
        receiverstate: state,
        receiverpin: pin
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

    getReceiverEditProfile: getReceiverEditProfile,
    postReceiverEditProfile: postReceiverEditProfile,
    getReceiverChangePassword: getReceiverChangePassword,
    postReceiverChangePassword: postReceiverChangePassword,
    deleteProfile: deleteProfile,

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