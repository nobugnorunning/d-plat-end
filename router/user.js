const router = require('express').Router();
const { reguserHandler, loginHandler } = require('../router_handler/user')

// 导入验证规则对象
const {reg_login_schema} = require('../schema/user')

// 导入验证规则的中间件依赖包
const expressJoi = require('@escook/express-joi')

// 注册用户
/*
* 使用局部中间件对传递过来的body数据进行校验
*   校验通过就执行后面的处理函数
*   校验不通过就会报错，使用全局错误中间件进行捕捉处理
* */
router.post('/reguser', expressJoi(reg_login_schema), reguserHandler)

// 登陆
router.post('/login', expressJoi(reg_login_schema), loginHandler)

module.exports = router
