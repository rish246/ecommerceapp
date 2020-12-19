const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./Routes/admin/auth/auth');
const adminProductsRouter = require('./Routes/admin/products');
const userProductsRouter = require('./Routes/user/userFrontPage');
const cartsRouter = require('./Routes/user/cart');
//cookieSession({keys}) is a middleware function
const app = express();

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
	//adds property req.session to the req object
	cookieSession({
		keys: [ 'lskjflsjf' ]
	})
);

app.use(userProductsRouter);

app.use(authRouter);
app.use(adminProductsRouter);

app.use(cartsRouter);

app.listen(5001, () => {
	console.log('Listening');
});
