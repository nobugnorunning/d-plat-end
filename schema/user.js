const joi = require('joi')

// 定义验证规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().alphanum().min(6).max(16).required()
const avatar = joi.string().dataUri().required()

exports.reg_login_schema = {
	body: {
		username,
		password
	}
}

exports.avatar_schema = {
	body: {
		avatar
	}
}
