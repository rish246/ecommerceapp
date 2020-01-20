const express = require('express');

const CartsRepo = require('../../repositories/cartsRepo');
const ProductsRepo = require('../../repositories/products');
const cartTemplate = require('../../views/cartView');
const router = express.Router();

//post request to add an item to a cart
router.post('/cart/products/:id', async (req, res) => {
	//define a cart
	let cart;
	//check if there is already a session running for the cart;
	if (!req.session.cartId) {
		cart = await CartsRepo.create({ items: [] });
		req.session.cartId = cart.id;
	} else {
		// cart = await CartsRepo.getOneBy({ id: req.params.id }); //this is not working
		cart = await CartsRepo.getOne(req.session.cartId);
	}

	//use find method as it alters the values in original array

	const existingItem = cart.items.find((item) => item.id === req.params.id);
	// console.log(cart); cart is getting undefined
	if (!existingItem) {
		//make a record for the item
		cart.items.push({
			id: req.params.id,
			quantity: 1
		});
	} else {
		existingItem.quantity++;
	}
	await CartsRepo.update(cart.id, {
		items: cart.items
	});
	res.redirect('/');
});

router.get('/cart', async (req, res) => {
	const cart = await CartsRepo.getOne(req.session.cartId);
	const finalItems = [];
	for (let item of cart.items) {
		const product = await ProductsRepo.getOne(item.id);
		product.quantity = item.quantity;
		finalItems.push(product);
	}

	res.send(cartTemplate({ items: finalItems }));
});

//put a post request to handle the removal of the product in the list

router.post('/cart/remove/:id', async (req, res) => {
	const cart = await CartsRepo.getOne(req.session.cartId);
	const { items } = cart;
	const itemToRemove = items.find((item) => item.id === req.params.id);
	//render the cart with these wanted records
	const index = items.indexOf(itemToRemove);
	items.splice(index, 1);
	await CartsRepo.update(cart.id, {
		items
	});
	res.redirect('/cart');
});

module.exports = router;
//handle all the routes related to shopping cart
