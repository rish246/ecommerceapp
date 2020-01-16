const layout = require('../layout');

const renderProducts = (products) => {
	let productsTemplate = ``;
	for (let product of products) {
		const { title, price } = product;
		productsTemplate += `
            <div class="item"> 
                <p>${title} </p>
                <p>${price}</p>
                <button> Edit</button>
                <button> Delete</button>
            </div>

        `;
	}
	return productsTemplate;
};

module.exports = ({ products }) => {
	//render the products in a string called products

	const productsTemplate = renderProducts(products);
	return layout({
		content: `
            <h1 class="title">Products</h1>
            ${productsTemplate}
        `
	});
};
