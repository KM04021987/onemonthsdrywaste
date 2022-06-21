import pickuprequestService from "./../services/pickuprequestService";

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

    pickuprequestService.extractPickupRequest(jsonaccount).then((data) => {
        return res.render("donorprofile.ejs",{
            account: jsonaccount,
            fullname: jsonfullname,
            phone: jsonphone_no,
            country: jsoncountry,
            state: jsonstate,
            city: jsoncity,
            pin: jsonpin_or_zip,
            address: jsonaddress,
            userData: data
        });
    }).catch(error => {
        console.log('error in handleDonorPage')
    });
};

let createPickupRequest = async (req, res) => {
    console.log('donorProfileController: createPickupRequest')
    const jsonData = JSON.stringify(req.user)
    const jsonParseObj = JSON.parse(jsonData)
    const jsonaccount = jsonParseObj.ACCOUNT
    //create a pickup request
    let pickupRequest = {
        account: jsonaccount,
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
    try {
        await pickuprequestService.createPickupRequest(pickupRequest);
        return res.redirect("/dprofile");
    } catch (err) {
        req.flash("errors", err);
        return res.redirect("/dprofile");
    }
};

let getEditPickup = async (req, res) => {
    console.log('donorProfileController: getEditPickup')
    await pickuprequestService.getPickupForEditPage(req.params.id).then((pickup) => {
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

    return res.render("editpickup.ejs", {
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
            account: jsonaccount,
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

let getReceiverList = async (req, res) => {
    console.log('donorProfileController: getReceiverList')
    let account = req.body.account
    let findByInfo = {
        country: req.body.country,
        state: req.body.state,
        pin: req.body.pin
    };
    await pickuprequestService.getReceiverList(findByInfo).then((data) => {
    return res.render("listofreceivers.ejs", {
        userData: data,
        donoraccount: account
    })
    }).catch(error => {
    console.log('error while finding receiver info')
    });
};

module.exports = {
    handleDonorPage: handleDonorPage,
    createPickupRequest: createPickupRequest,
    getEditPickup: getEditPickup,
    putEditPickup: putEditPickup,
    deletePickupById: deletePickupById,
    getReceiverList: getReceiverList
};