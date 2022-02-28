const router = require('express').Router();
const {
	getArticleCate,
	addArticleCate,
	deleteArticleCate,
	updateArticleCate,
	pubArticleCate,
	getAllArticles,
	deleteMyArticle,
	updateMyArticle
} = require('../router_handler/articles')
const {
	articleCate_schema,
	deleteCate_schema,
	updateCate_schema
} = require('../schema/articles')
const expressJoi = require('@escook/express-joi')

// 解析formdata格式数据
const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
	destination: function(req, res, cb){
		cb(null, path.join(__dirname, '../static/uploads'))
	},
	filename: function(req, file, cb){
		const date = Date.now()
		cb(null, date + '.' + file.originalname)
	}
})
const upload = multer({
	storage
})

// 获取文章分类
router.get('/article/cate', getArticleCate)

// 新增文章分类
router.post('/article/cate/add', expressJoi(articleCate_schema), addArticleCate)

// 根据分类id删除分类
router.post('/article/cate/delete', expressJoi(deleteCate_schema), deleteArticleCate)

// 根据分类id修改分类
router.post('/article/cate/update', expressJoi(updateCate_schema), updateArticleCate)

// 发布文章（存草稿）
router.post('/article/pub',  pubArticleCate)

// 获取文章详情（我的文章）
router.get('/articles', getAllArticles)

// 删除我的文章
router.post('/articles/del', deleteMyArticle)

// 修改我的文章
router.post('/articles/update', updateMyArticle)

module.exports = router
