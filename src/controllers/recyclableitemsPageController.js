let getRecyclableitemsPage = (req, res) => {
    console.log('recyclableitemsPageController: getRecyclableitemsPage')
    return res.render("recyclableitems.ejs", {
        errors: req.flash("errors")
    });
};

module.exports = {
    getRecyclableitemsPage: getRecyclableitemsPage
};