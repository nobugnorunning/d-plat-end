const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const joi = require('joi')
const expressJWT = require('express-jwt')
const config = require('./tokenConfig')
const app = express();

// 配置跨域
app.use(cors())

// 配置解析表单数据
// app.use(express.urlencoded({extended: false}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// 托管静态资源
app.use(express.static('./pages'))

// 封装 res 的通用处理函数
app.use((req, res, next) => {
	res.success = function(data = {}, msg = '交易成功'){
		res.send({
			iserr: 0,
			data,
			msg: msg !== '交易成功' ? msg : '交易成功'
		})
	}
	res.fail = function (err, msg = '交易失败'){
		res.send({
			iserr: 1,
			// 判断报错是否是一个错误对象
			msg: msg !== '交易失败' ? msg : err instanceof Error ? err.message : err
		})
	}
	next()
})

// 配置解析token的中间件
// unless代表不需要进行token解析的路径
/*
* 如果遇到报错： algorithms should be set
*   只需要在配置中加入 algorithms: ['HS256'] 即可，这个是代表这 jwt 的算法
* */
app.use(expressJWT({
	secret: config.jwtSecretKey,
	algorithms: ['HS256'],
}).unless({path: [/^\/api\//]}))

// 挂载路由
app.use('/api', require('./router/user'))
app.use('/api', require('./router/api_articles'))
app.use('/my', require('./router/userinfo'))
app.use('/access', require('./router/access/access.js'))
app.use('/my', require('./router/articles'))
app.use('/my', require('./router/goods/goods_cates'))

// 全局错误中间件
app.use((err, req, res, next) => {
	// 表单验证失败的处理
	if(err instanceof joi.ValidationError) return res.fail(err)

	// token解析失败或者没有携带token的处理
	if(err.name === 'UnauthorizedError') return res.status(401).fail(err, 'UnauthorizedError')

	res.fail(err)
})

app.listen(5566, function (){
	console.log('api_server is running at 5566')
})
