const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const scrypt = util.promisify(crypto.scrypt);
class UsersRepository {
	//what i want to do is to make a repository to pass the filename of the clas
	constructor(filename) {
		if (!filename) {
			throw new Error('Path is not specified for the repository');
		}
		this.filename = filename;
		try {
			fs.accessSync(this.filename); //why am i seeing this and not that
		} catch (err) {
			fs.writeFileSync(this.filename, '[]');
		}
	}

	async getAll() {
		const fileData = await fs.promises.readFile(this.filename, { encoding: 'utf8' });
		return JSON.parse(fileData);
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

	async comparePasswords(supplied, original) {
		const splitPassword = original.split('.');
		const [ correctPassword, salt ] = splitPassword;
		const buf = await scrypt(supplied, salt, 64);
		const finalPassword = buf.toString('hex');
		return finalPassword == correctPassword;
	}

	async writeAll(arr) {
		await fs.promises.writeFile(this.filename, JSON.stringify(arr, null, 2));
	}

	randomId() {
		return crypto.randomBytes(4).toString('hex');
	}

	async getOne(id) {
		const prevRecords = await this.getAll();
		return prevRecords.find((record) => record.id === id);
	}

	async delete(id) {
		const prevRecords = await this.getAll();
		const records = prevRecords.filter((record) => record.id !== id);
		await this.writeAll(records);
	}

	async getOneBy(filter) {
		const prevRecords = await this.getAll();
		const keys = Object.keys(filter);
		for (let record of prevRecords) {
			let found = 0;
			for (let key of keys) {
				if (record[key] === filter[key]) found++;
			}
			if (found == keys.length) return record;
		}
	}

	async update(id, attributes) {
		const prevRecords = await this.getAll();
		const record = prevRecords.find((record) => record.id === id);
		Object.assign(record, attributes);
		await this.writeAll(prevRecords);
	}
}

module.exports = new UsersRepository('users.json');
