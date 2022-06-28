let getHomePage = (req, res) => {
    console.log('homePageController: getHomePage')
    return res.render("homepage.ejs", {
        errors: req.flash("errors")
    });
};

let getAboutPage = (req, res) => {
    console.log('homePageController: getAboutPage')
    return res.render("about.ejs", {
        errors: req.flash("errors")
    });
};

let getRecyclableitemsPage = (req, res) => {
    console.log('homePageController: getRecyclableitemsPage')
    return res.render("recyclableitems.ejs", {
        errors: req.flash("errors")
    });
};

let getStepstofollowPage = (req, res) => {
    console.log('homePageController: getStepstofollowPage')
    return res.render("stepstofollow.ejs", {
        errors: req.flash("errors")
    });
};

let getPrivacyPage = (req, res) => {
    console.log('homePageController: getPrivacyPage')
    return res.render("Privacy.ejs", {
        errors: req.flash("errors")
    });
};

let getFaqPage = (req, res) => {
    console.log('homePageController: getFaqPage')
    return res.render("faq.ejs", {
        errors: req.flash("errors")
    });
};

module.exports = {
    getHomePage: getHomePage,
    getAboutPage: getAboutPage,
    getRecyclableitemsPage: getRecyclableitemsPage,
    getStepstofollowPage: getStepstofollowPage,
    getPrivacyPage: getPrivacyPage,
    getFaqPage: getFaqPage
};