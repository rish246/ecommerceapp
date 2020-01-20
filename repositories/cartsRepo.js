const mainRepo = require('./mainRepo');

class CartsRepo extends mainRepo {}

module.exports = new CartsRepo('carts.json');
