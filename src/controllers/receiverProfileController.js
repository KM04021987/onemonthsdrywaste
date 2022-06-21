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

let getSearchPickup = async (req, res) => {
    console.log('donorProfileController: getSearchPickup')
    return res.render("searchpickup.ejs", {
        errors: req.flash("errors")
    });
};

module.exports = {
    handleReceiverPage: handleReceiverPage,
    getSearchPickup: getSearchPickup
};