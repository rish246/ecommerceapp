const express = require('express');
const productsRepo = require('../../repositories/products');
const frontPageTemplate = require('../../views/user/frontPageTemplate');

const router = express.Router();
//when we get a get request for root path we will render the mainPage.js Template
router.get('/', async (req, res) => {
	const products = await productsRepo.getAll();
	res.send(frontPageTemplate({ products }));
});

module.exports = router;
