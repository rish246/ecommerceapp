const { validationResult } = require('express-validator');

module.exports = {
	handleErrors(templateFunc, dataCallback) {
		//today we will improve this middleware
		return async (req, res, next) => {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				let product = {}; //let say there is not product
				if (dataCallback) {
					//if product is sent
					product = await dataCallback(req); //assign product as the new product which is getting edited else {}
				}

				return res.send(templateFunc({ errors, ...product })); //the func will take product obj and destructure the values to asign to product object
			}
			//cannot read property title of undefined

			next();
		};
	},

	isSignedIn() {
		return (req, res, next) => {
			if (!req.session.userId) {
				return res.redirect('/signin');
			}
			next();
		};
	}
};
