const mainRepo = require('./mainRepo');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);
class UsersRepository extends mainRepo {
	async comparePasswords(supplied, original) {
		const splitPassword = original.split('.');
		const [ correctPassword, salt ] = splitPassword;
		const buf = await scrypt(supplied, salt, 64);
		const finalPassword = buf.toString('hex');
		return finalPassword == correctPassword;
	}
	async create(attributes) {
		//create a salt for the hashing purpose
		const { password } = attributes;
		attributes.id = this.randomId();
		const salt = crypto.randomBytes(8).toString('hex');
		const buf = await scrypt(password, salt, 64);
		const prevRecords = await this.getAll();
		const newRecord = {
			...attributes,
			password: `${buf.toString('hex')}.${salt}`
		};
		prevRecords.push(newRecord);
		await this.writeAll(prevRecords);
		return newRecord;
	}
}

module.exports = new UsersRepository('users.json');
