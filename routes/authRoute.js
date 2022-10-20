const express = require('express')
const { registration, login, changeActiveStatus, deleteAccount, restrictedTo, protected, allAccount } = require('../controllers/authController')
const router = express.Router()

router.route('/login')
    .post(login)

router.use(protected)

router.route('/create-account')
    .post(restrictedTo('super-admin'), registration)

router.route('/change-active-status/:id')
    .patch(restrictedTo('super-admin', 'admin'), changeActiveStatus)

router.route('/delete/:id')
    .delete(restrictedTo('super-admin'), deleteAccount)

router.route('/')
    .get(restrictedTo('super-admin'), allAccount)

module.exports = router