const express = require('express')
const { createNewProduct, getAllProducts, getSpecificProduct, updateProduct, deleteProduct, productCategory, searchProduct, allProductInCategory, allProductInBrand, topDeals } = require('../controllers/productController')
const { protected, restrictedTo } = require('./../controllers/authController')
const router = express.Router()


router.route('/create')
    .post(protected, restrictedTo('super-admin', 'admin', 'officer'), createNewProduct)

router.route('/')
    .get(getAllProducts)

router.route('/top-10-deals')
    .get(topDeals, getAllProducts)

router.route('/category')
    .get(productCategory)

router.route('/category/:category')
    .get(allProductInCategory)

router.route('/brand/:brand')
    .get(allProductInBrand)

router.route('/search')
    .get(searchProduct)

router.route('/:id')
    .get(getSpecificProduct)
    .patch(protected, restrictedTo('super-admin', 'admin', 'officer'), updateProduct)
    .delete(protected, restrictedTo('super-admin', 'admin', 'officer'), deleteProduct)

module.exports = router