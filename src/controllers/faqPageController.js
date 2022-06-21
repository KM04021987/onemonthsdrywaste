let getFaqPage = (req, res) => {
    console.log('faqPageController: getFaqPage')
    return res.render("faq.ejs", {
        errors: req.flash("errors")
    });
};

module.exports = {
    getFaqPage: getFaqPage
};