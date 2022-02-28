const joi = require('joi')

// 定义验证规则
const
	username = joi.string().alphanum().min(1).max(10),
	nickname = joi.string().alphanum().min(1).max(10),
	email = joi.string().email(),
	oldpwd = joi.string().alphanum().min(6).max(16).required(),
	newpwd = joi.string().alphanum().min(6).max(16).required(),
	repwd = joi.string().alphanum().min(6).max(16).required()

// 用户信息校验
exports.userinfo_schema = {
	body: {
		username,
		nickname,
		email
	}
}

// 重置密码校验
exports.resetPwd_schema = {
	body: {
		oldpwd,
		newpwd,
		repwd
	}
}
