var express = require('express')
var router = express.Router()

const shopController = require('../controllers/shop.controller')
const requireLogin = require('../middleware/requireLogin')

// render to create shop
router.get("/",  shopController.index);

// add a shop
router.post("/createshop",requireLogin, shopController.createPost);

router.post("/addshop",requireLogin, shopController.addShopUser);

// // get manage my shop
// router.get("/manageShop/:id",  shopController.manageShop);

// // add book in listBook
// router.post("/manageShop/",  shopController.addBook);

// //get customer shop
// router.get("/customerShop/:id", shopController.customerShop)

module.exports = router;