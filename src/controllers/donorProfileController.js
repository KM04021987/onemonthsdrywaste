import pickuprequestService from "./../services/pickuprequestService";
import messageinfoService from "./../services/messageinfoService";
import donorloginService from "./../services/donorloginService";

let handleDonorPage = async (req, res) => {
    console.log('donorProfileController: handleDonorPage')
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

    donorloginService.findUserByPhone(jsonphone_no).then(async (donoruser) => {
        if (!donoruser) {
            return res.render("donorprofilenotcorrect.ejs")
        }
        else {
            return res.render("donorprofile.ejs",{
                donoraccount: jsonaccount,
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


let getRequestANewPickupForm = async (req, res) => {
    console.log('donorProfileController: getRequestANewPickupForm')
    const donoraccount = req.params.id
    return res.render("donorrequestanewpickup.ejs", {
        donoraccount: donoraccount
    })
}

let postNewPickupRequest = async (req, res) => {
    console.log('donorProfileController: postNewPickupRequest')

    const donoraccount = req.params.id
    //create a pickup request
    let pickupRequest = {
        donoraccount: donoraccount,
        plasticbottle: req.body.plasticbottle,
        plastcwrapper: req.body.plastcwrapper,
        glassbottle: req.body.glassbottle,
        metalcans: req.body.metalcans,
        paperbox: req.body.paperbox,
        others: req.body.others,
        country: req.body.country,
        state: req.body.state,
        city: req.body.city,
        pin: req.body.pin,
        address: req.body.address,
        phone: req.body.phone
    };
    await pickuprequestService.createPickupRequest(pickupRequest).then(() => {
        pickuprequestService.getPickupRequestNumber(donoraccount).then((data) => {
            const jsonData = JSON.stringify(data)
            const removebracket1 = jsonData.replace('[','')
            const removebracket2 = removebracket1.replace(']','')
            const jsonParseobj = JSON.parse(removebracket2)
            const pickupRequestNumber = jsonParseobj.PICKUP_REQUEST_NO

            return res.render("donorpostnewpickuprequest.ejs", {
                donoraccount: donoraccount,
                pickupRequestNumber: pickupRequestNumber
            })
        }).catch(error => {
            console.log("error while fetching pickup request")
        });
    }).catch(error => {
        console.log("error while creating a new pickup request")
    });
};

let getRequestsHistory = async (req, res) => {
    console.log('donorProfileController: getRequestsHistory')
    const jsonData = JSON.stringify(req.user)
    const jsonParseObj = JSON.parse(jsonData)
    const jsonaccount = jsonParseObj.ACCOUNT
    const donoraccount = jsonaccount

    pickuprequestService.extractPickupRequest(donoraccount).then((data) => {
        return res.render("donorrequestshistory.ejs",{
            donoraccount: donoraccount,
            userData: data
        });
    }).catch(error => {
        console.log('error in getRequestsHistory')
    });
};

let getEditPickup = async (req, res) => {
    console.log('donorProfileController: getEditPickup')
    const pickuprequestno = req.params.id
    await pickuprequestService.getPickupForEditPage(pickuprequestno).then((pickup) => {
    const jsonData = JSON.stringify(pickup)
    const removebracket1 = jsonData.replace('[','')
    const removebracket2 = removebracket1.replace(']','')
    const jsonParseobj = JSON.parse(removebracket2)

    const jsonPICKUP_REQUEST_NO = jsonParseobj.PICKUP_REQUEST_NO
    const jsonDONOR_ACCOUNT = jsonParseobj.DONOR_ACCOUNT
    const jsonPLASTIC_BOTTLE = jsonParseobj.PLASTIC_BOTTLE
    const jsonPLASTIC_WRAPPER = jsonParseobj.PLASTIC_WRAPPER
    const jsonGLASS_BOTTLE = jsonParseobj.GLASS_BOTTLE
    const jsonMETAL_CANS = jsonParseobj.METAL_CANS
    const jsonPAPER_WASTE = jsonParseobj.PAPER_WASTE
    const jsonOTHER_WASTE = jsonParseobj.OTHER_WASTE
    const jsonDONOR_COUNTRY = jsonParseobj.DONOR_COUNTRY
    const jsonDONOR_STATE = jsonParseobj.DONOR_STATE
    const jsonDONOR_CITY = jsonParseobj.DONOR_CITY
    const jsonDONOR_PIN_OR_ZIP = jsonParseobj.DONOR_PIN_OR_ZIP
    const jsonDONOR_ADDRESS = jsonParseobj.DONOR_ADDRESS
    const jsonDONOR_PHONE_NO = jsonParseobj.DONOR_PHONE_NO

    return res.render("donoreditpickup.ejs", {
        donoraccount: jsonDONOR_ACCOUNT,
        PICKUP_REQUEST_NO: jsonPICKUP_REQUEST_NO,
        DONOR_ACCOUNT: jsonDONOR_ACCOUNT,
        PLASTIC_BOTTLE: jsonPLASTIC_BOTTLE,
        PLASTIC_WRAPPER: jsonPLASTIC_WRAPPER,
        GLASS_BOTTLE: jsonGLASS_BOTTLE,
        METAL_CANS: jsonMETAL_CANS,
        PAPER_WASTE: jsonPAPER_WASTE,
        OTHER_WASTE: jsonOTHER_WASTE,
        DONOR_COUNTRY: jsonDONOR_COUNTRY,
        DONOR_STATE: jsonDONOR_STATE,
        DONOR_CITY: jsonDONOR_CITY,
        DONOR_PIN_OR_ZIP: jsonDONOR_PIN_OR_ZIP,
        DONOR_ADDRESS: jsonDONOR_ADDRESS,
        DONOR_PHONE_NO: jsonDONOR_PHONE_NO
    })
    }).catch(error => {
    console.log('error while fetching pickup request')
    });
};

let putEditPickup = async (req, res) => {
    console.log('donorProfileController: putEditPickup')
    const jsonData = JSON.stringify(req.user)
    const jsonParseObj = JSON.parse(jsonData)
    const jsonaccount = jsonParseObj.ACCOUNT
    try {
        let item = {
            donoraccount: jsonaccount,
            requestno: req.body.id,
            plasticbottle: req.body.plasticbottle,
            plastcwrapper: req.body.plastcwrapper,
            glassbottle: req.body.glassbottle,
            metalcans: req.body.metalcans,
            paperbox: req.body.paperbox,
            others: req.body.others,
            country: req.body.country,
            state: req.body.state,
            city: req.body.city,
            pin: req.body.pin,
            address: req.body.address,
            phone: req.body.phone
        };
        await pickuprequestService.updatePickupInfo(item);
        return res.status(200).json({
            message: 'update info pickup successful'
        });
    } catch (e) {
        console.log(e)
        return res.status(500).json(e);
    }
};


let deletePickupById = async (req, res) => {
    console.log('donorProfileController: deletePickupById')
    try {
        let pickup = await pickuprequestService.deletePickupById(req.body.id);
        return res.status(200).json({
            'message': 'success'
        })

    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

let getSearchReceiversForm = async (req, res) => {
    console.log('donorProfileController: getSearchReceiversForm')
    const donoraccount = req.params.id
    return res.render("donorsearchreceiversnearme.ejs", {
        donoraccount: donoraccount
    })
}

let showListOfReceivers = async (req, res) => {
    console.log('donorProfileController: showListOfReceivers')
    let donoraccount = req.params.id
    let findByInfo = {
        country: req.body.country,
        state: req.body.state,
        pin: req.body.pin
    };
    await pickuprequestService.getReceiverList(findByInfo).then((data) => {
    return res.render("donorlistofreceivers.ejs", {
        userData: data,
        donoraccount: donoraccount,
        country: req.body.country,
        state: req.body.state,
        pin: req.body.pin
    })
    }).catch(error => {
    console.log('error while finding receiver info')
    });
};

let sendMessageToReceiver = async (req, res) => {
    console.log('receiverProfileController: sendMessageToReceiver')
    const donoraccount = req.body.donoraccount
    const receiveraccount = req.body.receiveraccount
    const messageContent = req.body.messageContent

    await messageinfoService.saveDonorsMessage(donoraccount, receiveraccount, messageContent).then(() => {
        let findByInfo = {
            country: req.body.country,
            state: req.body.state,
            pin: req.body.pin
        };
        pickuprequestService.getReceiverList(findByInfo).then((data) => {
            return res.render("donorlistofreceivers.ejs", {
                userData: data,
                donoraccount: donoraccount,
                country: req.body.country,
                state: req.body.state,
                pin: req.body.pin
            })
        }).catch(error => {
            console.log("error while fetching receiver's information")
        });
    }).catch(error => {
        console.log("error while saving the donor's message")
    });
}

let getDonorChatHistoryList = async (req, res) => {
    console.log('donorProfileController: getDonorChatHistoryList')
    let donoraccount = req.params.id

    messageinfoService.getChatListOfDonor(donoraccount).then((data) => {
    return res.render("donorchathistorylist.ejs", {
        userData: data,
        donoraccount: donoraccount
    })
    }).catch(error => {
    console.log("error while finding Donor's Chat History")
    });
};


let showDonorChatHistory = async (req, res) => {
    console.log('donorProfileController: showDonorChatHistory')
    const donoraccount = req.body.donoraccount
    const receiveraccount = req.params.id
    const fullname = req.body.fullname

    await messageinfoService.getDonorChatHistory(donoraccount, receiveraccount).then((data) => {
    return res.render("donorchatdetails.ejs", {
        userData: data,
        donoraccount: donoraccount,
        receiveraccount: receiveraccount,
        fullname: fullname
    })
    }).catch(error => {
    console.log('error while finding Donor Chat Details')
    });
};

let sendMessageRealtimeToReceiver = async (req, res) => {
    console.log('receiverProfileController: sendMessageRealtimeToReceiver')
    const donoraccount = req.body.donoraccount
    const receiveraccount = req.params.id
    const messageContent = req.body.messageContent
    const fullname = req.body.fullname

    await messageinfoService.saveDonorsMessage(donoraccount, receiveraccount, messageContent).then(() => {
        messageinfoService.getDonorChatHistory(donoraccount, receiveraccount).then((data) => {
            return res.render("donorchatdetails.ejs", {
                userData: data,
                donoraccount: donoraccount,
                receiveraccount: receiveraccount,
                fullname: fullname
            })
            }).catch(error => {
            console.log('error while finding Chat History')
            });
    }).catch(error => {
        console.log("error while saving the donor's message")
    });
}

let refreshDonorRealtime = async (req, res) => {
    console.log('donorProfileController: refreshDonorRealtime')
    const jsonData = JSON.stringify(req.user)
    const jsonParseObj = JSON.parse(jsonData)
    const jsonaccount = jsonParseObj.ACCOUNT
    const donoraccount = jsonaccount
    const receiveraccount = req.params.id

    await messageinfoService.getDonorChatHistory(donoraccount, receiveraccount).then((data) => {
    return res.render("donorrefreshmessage.ejs", {
        userData: data,
        donoraccount: donoraccount,
        receiveraccount: receiveraccount
    })
    }).catch(error => {
    console.log('error while finding Chat History')
    });
}

module.exports = {
    handleDonorPage: handleDonorPage,

    getRequestANewPickupForm: getRequestANewPickupForm,
    postNewPickupRequest: postNewPickupRequest,

    getRequestsHistory: getRequestsHistory,
    getEditPickup: getEditPickup,
    putEditPickup: putEditPickup,
    deletePickupById: deletePickupById,

    getSearchReceiversForm: getSearchReceiversForm,
    showListOfReceivers: showListOfReceivers,
    sendMessageToReceiver: sendMessageToReceiver,

    getDonorChatHistoryList: getDonorChatHistoryList,
    showDonorChatHistory: showDonorChatHistory,
    sendMessageRealtimeToReceiver: sendMessageRealtimeToReceiver,
    refreshDonorRealtime: refreshDonorRealtime
};