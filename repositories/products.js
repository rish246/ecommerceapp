const mainRepo = require('./mainRepo');
class ProductsRepo extends mainRepo {}
module.exports = new ProductsRepo('products.json');
