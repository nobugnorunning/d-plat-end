const joi = require('joi')

const role_name = joi.string().required(),
	role_value = joi.string().required(),
	role_access = joi.string().required()

exports.addRoles_schema = {
	body: {
		role_name,
		role_value,
		role_access
	}
}
