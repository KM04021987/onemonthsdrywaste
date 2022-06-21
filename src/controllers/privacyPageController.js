let getPrivacyPage = (req, res) => {
    console.log('privacyPageController: getPrivacyPage')
    return res.render("Privacy.ejs", {
        errors: req.flash("errors")
    });
};

module.exports = {
    getPrivacyPage: getPrivacyPage
};