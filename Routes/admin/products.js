///requests from an external library
const express = require('express');
const multer = require('multer');

//requests from within the file
const { requireTitle, requirePrice } = require('../../Routes/admin/auth/validations');
const productsRepo = require('../../repositories/products');
const createProductTemplate = require('../../views/admin/products/createNewProduct');
const editProductTemplate = require('../../views/admin/products/editProduct');

const { handleErrors, isSignedIn } = require('../../views/admin/auth/middlewares');
const adminProductsTemplate = require('../../views/admin/products/adminProducts');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() }); //store the file in the multer's memory storage //a middleware to check if the user is signed in or not

router.get('/admin/products', isSignedIn(), async (req, res) => {
	const products = await productsRepo.getAll();
	res.send(adminProductsTemplate({ products }));
});
router.get('/admin/products/new', isSignedIn(), (req, res) => {
	res.send(createProductTemplate({}));
});

router.post(
	'/admin/products/new',
	isSignedIn(),
	upload.single('image'),
	[ requireTitle, requirePrice ],
	handleErrors(createProductTemplate),
	async (req, res) => {
		const image = req.file.buffer.toString('base64');
		const { title, price } = req.body;
		const userId = req.session.userId;
		console.log(userId);
		await productsRepo.create({ title, price, image });
		res.redirect('/admin/products');
	}
);
//create a route handler for editing an existing item
router.get('/admin/products/:id/edit', isSignedIn(), async (req, res) => {
	const product = await productsRepo.getOne(req.params.id);
	if (!product) {
		return res.send('Product not found');
	}

	return res.send(editProductTemplate({ product }));
});
//so we have to edit the middleware so that it can handle wrong values
router.post(
	'/admin/products/:id/edit',
	isSignedIn(),
	upload.single('image'),
	[ requireTitle, requirePrice ],
	handleErrors(editProductTemplate, async (req) => {
		const product = await productsRepo.getOne(req.params.id);
		return { product };
	}),
	async (req, res) => {
		const changes = req.body;
		//check for any potential upload of image
		if (req.file) {
			changes.image = req.file.buffer.toString('base64');
		}

		// check whether if there is a product that matches with the id, if not res.send(couldn't find the product)
		try {
			await productsRepo.update(req.params.id, changes);
		} catch (err) {
			return res.send("couldn't find the product");
		}
		res.redirect('/admin/products');
	}
);
//create a post request handler to apply the changes in the field tag as the

//post a get request handler to handle the delete operatio
router.post('/admin/products/:id/delete', isSignedIn(), async (req, res) => {
	await productsRepo.delete(req.params.id);
	res.redirect('/admin/products');
});
module.exports = router;
