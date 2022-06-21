let getStepstofollowPage = (req, res) => {
    console.log('stepstofollowPageController: getStepstofollowPage')
    return res.render("stepstofollow.ejs", {
        errors: req.flash("errors")
    });
};

module.exports = {
    getStepstofollowPage: getStepstofollowPage
};