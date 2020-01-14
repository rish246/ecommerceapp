const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./Routes/admin/auth');
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
app.use(authRouter);
app.listen(5000, () => {
	console.log('sup');
});
