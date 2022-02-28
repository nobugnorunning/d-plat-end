const joi = require('joi')

const label = joi.string().required(),
	type = joi.number().integer().min(0).max(2).required(),
	parent_id = joi.string()

exports.add_cate_schema = {
	body: {
		label,
		type,
		parent_id
	}
}
