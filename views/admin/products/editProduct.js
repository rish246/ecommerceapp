const layout = require('../layout');
const { getError } = require('../../helpers');
//we should give the same minimum length as the create new page
//so we can use createnew to edit the page as well
module.exports = ({ product, errors }) => {
	const { title, price } = product;
	return layout({
		content: `
        <div class="columns is-centered">
        <div class="column is-half">
          <h1 class="subtitle">Edit the product</h1>

          <form method="POST" enctype="multipart/form-data">
            <div class="field">
              <label class="label">Title</label>
              <input class="input" placeholder="Title" name="title" value="${title}">
              <p class="help is-danger">${getError(errors, 'title')}</p>
            </div>
            
            <div class="field">
              <label class="label">Price</label>
              <input class="input" placeholder="Price" name="price" value="${price}">
              <p class="help is-danger">${getError(errors, 'price')}</p>
            </div>
            
            <div class="field">
              <label class="label">Image</label>            
              <input type="file" name="image" />
            </div>
            <br />
            <button class="button is-primary">Save</button>
          </form>
        </div>
      </div>
        
        `
	});
};
