let getHomePage = (req, res) => {
    console.log('homePageController: getHomePage')
    return res.render("homepage.ejs", {
        errors: req.flash("errors")
    });
};

module.exports = {
    getHomePage: getHomePage
};