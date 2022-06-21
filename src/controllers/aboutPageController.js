let getAboutPage = (req, res) => {
    console.log('aboutPageController: getAboutPage')
    return res.render("about.ejs", {
        errors: req.flash("errors")
    });
};

module.exports = {
    getAboutPage: getAboutPage
};