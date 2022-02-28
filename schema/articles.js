const joi = require('joi')

const name = joi.string().min(1).max(15).required(),
	alias = joi.string().alphanum().min(1).max(15).required(),
	cate_id = joi.string().required(),
	name_update = joi.string().min(1).max(15),
	alias_update = joi.string().alphanum().min(1).max(15)

// 发布文章的校验
// const
// 	title = joi.string().min(1).max(15).required(),
// 	content = joi.required(),
// 	cover_img = joi.required()

exports.articleCate_schema = {
	body: {
		name,
		alias
	}
}

exports.deleteCate_schema = {
	body: {
		cate_id
	}
}

exports.updateCate_schema = {
	body: {
		cate_id,
		name: name_update,
		alias: alias_update
	}
}

exports.updateMyArticle = {
	body: {

	}
}
