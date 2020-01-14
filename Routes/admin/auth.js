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
const usersRepo = require('../../repositories/users');
const signInForm = require('../../views/admin/signin');
const signUpForm = require('../../views/admin/signup');
//creating a subRouter
//use express to improve validation and handle errors
const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signUpForm({ req }));
});

//the next function is the following callback which is passed as middleware

router.post(
	'/signup',
	[ requireEmail, requirePassword, requirePasswordConfirmation, comparePasswords ], //validation process
	async (req, res) => {
		const errors = validationResult(req);
		console.log(errors); //not able to enter password
		const { email, password } = req.body;
		//not creating another user
		//not able to continue the signup process
		if (!errors.isEmpty()) {
			return res.send(signUpForm({ req, errors }));
		}
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

router.post(
	'/signin',
	[ validateEmail, validatePassword ], //since the email validator has validated the email hence the req.body.email = user.email ],
	async (req, res) => {
		const errors = validationResult(req);
		const { email } = req.body;
		console.log(errors);
		const user = await usersRepo.getOneBy({ email });
		if (!errors.isEmpty()) {
			return res.send(signInForm({ errors }));
		} else {
			req.session.userId = user.id;
			res.send('session started');
		}
	}
);

module.exports = router;
