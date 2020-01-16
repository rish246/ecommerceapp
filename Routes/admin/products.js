///requests from an external library
const express = require('express');
const multer = require('multer');

//requests from within the file
const { requireTitle, requirePrice } = require('../../Routes/admin/auth/validations');
const productsRepo = require('../../repositories/products');
const createProductTemplate = require('../../views/admin/products/createNewProduct');
const { handleErrors } = require('../../views/admin/auth/middlewares');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); //store the file in the multer's memory storage

router.get('/admin/products', async (req, res) => {
	const products = await productsRepo.getAll();
	for (let product of products) {
		console.log(product.title);
	}
});

router.get('/admin/products/new', (req, res) => {
	res.send(createProductTemplate({}));
});

router.post(
	'/admin/products/new',
	upload.single('image'),
	[ requireTitle, requirePrice ],
	handleErrors(createProductTemplate),
	async (req, res) => {
		const image = req.file.buffer.toString('base64');
		const { title, price } = req.body;
		const userId = req.session.userId;
		console.log(userId);
		await productsRepo.create({ title, price, image });
		res.send('Product added to the list');
	}
);
module.exports = router;
