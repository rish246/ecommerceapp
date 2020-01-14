//purpose of this file is to contain the validation code and to be required in auth.js
const usersRepo = require('../../repositories/users');
const { check, body } = require('express-validator');

const validate = {
	requireEmail: check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Email already in use')
		.custom(async (email) => {
			const currentUser = await usersRepo.getOneBy({ email });
			if (currentUser) {
				throw new Error('email already in use');
			}
		}),
	requirePassword: check('password')
		.trim()
		.isLength({ min: 6 })
		.withMessage('password must be at least 6 characters long'),

	requirePasswordConfirmation: check('confirmPassword')
		.trim()
		.isLength({ min: 6 })
		.withMessage('password must be at least 6 characters long'),

	comparePasswords: body('confirmPassword').custom((confirmPassword, { req }) => {
		if (confirmPassword != req.body.password) {
			throw new Error('passwords much match');
		} else {
			return true;
		}
	}),
	validateEmail: check('email').trim().isEmail().withMessage("Sorry couldn't find that one").custom(async (email) => {
		const user = await usersRepo.getOneBy({ email });
		if (!user) {
			throw new Error('email does not exist');
		}
	}),

	validatePassword: check('password')
		.trim()
		.notEmpty()
		.withMessage('password entered is increct')
		.custom(async (password, { req }) => {
			const user = await usersRepo.getOneBy({ email: req.body.email });
			if (!user) {
				throw new Error('Password enterd is incorrect');
			} else {
				//we have to check here as well that the email does exist
				const validPassword = await usersRepo.comparePasswords(password, user.password);
				if (!validPassword) {
					throw new Error('Password entered is incorrect');
				}
			}
		})
};

module.exports = validate;
