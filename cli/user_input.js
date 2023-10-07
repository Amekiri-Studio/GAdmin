const readline = require('readline');

function getUserInput(rl, message) {
	return new Promise((resolve) => {
	    rl.question(message, (answer) => {
		    resolve(answer.toLowerCase());
	    });
	});
}

class UserInput {
	constructor() {
		const rl = readline.createInterface({
			input: process.stdin,
			output: process.stdout
	  	});
		this.rl = rl;
	}

	async getUserInput(message) {
		return await getUserInput(this.rl, message);
	}

	closeReadline() {
		this.rl.close();
	}
}

module.exports = {
	UserInput
}