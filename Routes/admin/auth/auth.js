const express = require('express');
const { body, check, validationResult } = require('express-validator');
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
		const errors = validationResult(req);
		const { email, password } = req.body;
		const user = await usersRepo.create({ email, password });
		console.log(user);
		req.session.userId = user.id;
		res.send('account created');
	}
);

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You have been logged!');
});

router.get('/signin', (req, res) => {
	res.send(signInForm({}));
});

router.post('/signin', [ validateEmail, validatePassword ], handleErrors(signInForm), async (req, res) => {
	const { email } = req.body;
	const user = await usersRepo.getOneBy({ email });
	req.session.userId = user.id;
	res.send('session started');
});

module.exports = router;
