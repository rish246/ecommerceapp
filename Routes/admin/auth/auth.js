const express = require('express');
const {
	requireEmail,
	requirePassword,
	requirePasswordConfirmation,
	comparePasswords,
	validateEmail,
	validatePassword
} = require('./validations');
const usersRepo = require('../../../repositories/users');
const signInForm = require('../../../views/admin/auth/signin');
const signUpForm = require('../../../views/admin/auth/signup');
const { handleErrors } = require('../../../views/admin/auth/middlewares');
//creating a subRouter
//use express to improve validation and handle errors
const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signUpForm({ req }));
});

//the next function is the following callback which is passed as middleware

router.post(
	'/signup',
	[ requireEmail, requirePassword, requirePasswordConfirmation, comparePasswords ],
	handleErrors(signUpForm),
	async (req, res) => {
		const { email, password } = req.body;
		const user = await usersRepo.create({ email, password });
		console.log(user);
		req.session.userId = user.id;
		res.redirect('/admin/products');
	}
);

router.get('/signout', (req, res) => {
	req.session = null;
	res.redirect('/signin');
});

router.get('/signin', (req, res) => {
	res.send(signInForm({}));
});

router.post('/signin', [ validateEmail, validatePassword ], handleErrors(signInForm), async (req, res) => {
	const { email } = req.body;
	const user = await usersRepo.getOneBy({ email });
	req.session.userId = user.id;
	res.redirect('/admin/products');
	//for some reason it is not redirecting me to /admin/products
});

module.exports = router;
