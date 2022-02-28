const router = require('express').Router();

const expressJoi = require('@escook/express-joi')

// 导入路由处理函数
const { addCate_handler, getCate_handler, getCateById_handler } = require('../../router_handler/goods/goods_cates')

// 导入校验规则
const { add_cate_schema } = require('../../schema/goods/goods_cates')

// 新增分类
router.post('/cate/add', expressJoi(add_cate_schema), addCate_handler)

// 查询分类
router.post('/cate/list', getCate_handler)

// 根据id查询子分类
router.post('/cate/listbyid', getCateById_handler)

module.exports = router
