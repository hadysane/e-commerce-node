const express = require('express');
const productController = require('../controllers/productController')
const router = express.Router();

// si on reçois un id il va executer le middleware
// router.param('id', productController.checkId)

// parametre  post (contoller, middleware)
// router.route('/').get(productController.getAllProducts).post(productController.checkbody, productController.createProduct)


router.route('/').get(productController.getAllProducts).post(productController.createProduct)

router.route('/:id')
    .get(productController.getProduct)
    .patch(productController.updateProduct)
    .delete(productController.deleteProduct)

module.exports = router; 