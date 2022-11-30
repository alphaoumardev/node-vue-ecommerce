const path = require("path");
// set development environment
process.env.NODE_ENV = 'test';
const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require(path.join(process.cwd(), "app"));
chai.use(chaiHttp);

const config = require(path.join(process.cwd(), "test/configs/config"));
const loginURL = config.baseURL + "login";

module.exports.login = function(username,password,cb) {
	// admin login	
	chai
	.request(app)
	.post(loginURL)
	.send({"username":username,"password":password})
	.end(cb);
}

