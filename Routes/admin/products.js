///requests from an external library
const express = require('express');
const multer = require('multer');
const { validationResult } = require('express-validator');

//requests from within the file
const { requireTitle, requirePrice } = require('../../Routes/admin/auth/validations');
const productsRepo = require('../../repositories/products');
const createProductTemplate = require('../../views/admin/products/createNewProduct');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); //store the file in the multer's memory storage

router.get('/admin/products', (req, res) => {
	//display the admin products
	//getAll()
});

router.get('/admin/products/new', (req, res) => {
	//create a new product
	//productRepository.create(attrs)
	res.send(createProductTemplate({}));
});

router.post('/admin/products/new', upload.single('image'), [ requireTitle, requirePrice ], async (req, res) => {
	const image = req.file.buffer.toString('base64');
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		return res.send(createProductTemplate({ errors }));
	}
	const { title, price } = req.body;

	await productsRepo.create({ title, price, image });
	res.send('Product added to the list');
});
module.exports = router;
