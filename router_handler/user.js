const sql = require('../db/mysql')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('../tokenConfig')

// 注册
exports.reguserHandler = function (req, res){
	const userinfo = req.body
	// // 是否传了空值
	// 使用了joi验证之后就不需要这个了
	// if(!userinfo.username || !userinfo.password){
	// 	return res.status(400).send({
	// 		iserr: 1,
	// 		msg: '用户名或密码不能为空'
	// 	})
	// }

	// 用户名是否已存在
	const sqlStr = `select * from ev_user where username=?`
	sql.query(sqlStr, [userinfo.username], (err, result) => {
		if(!err){
			if(result.length > 0){
				res.fail(err, '用户已存在')
			}else {
				// 用户名可用，插入到数据库
				// 将密码先加密
				var salt = bcrypt.genSaltSync(10)
				userinfo.password = bcrypt.hashSync(userinfo.password, salt)

				sql.query('insert into ev_user set ?', {username: userinfo.username, password: userinfo.password}, (error, data) => {
					if(error){
						return res.fail(err)
					}
					if(data.affectedRows !== 1){
						return res.fail(err, '注册用户失败')
					}
					res.success({}, '注册用户成功')
				})
			}
		}else {
			res.fail(err)
		}
	})
}

// 登陆
exports.loginHandler = function(req, res){
	// 获取用户信息
	const userinfo = req.body
	sql.query('select * from ev_user where username=?', [userinfo.username], (err, result) => {
		if(err){
			res.fail(err)
		}else {
			if(result.length === 0){
				res.fail(err, '用户不存在')
			}else {
				// 验证用户输入的密码是否和数据库里的一样
				const compareRes = bcrypt.compareSync(userinfo.password, result[0].password)
				if(!compareRes) return res.fail(err, '输入的密码有误')

				// 密码验证正确就生成token
				// 将password和user_pic去掉
				const resultCopy = {...result[0]}
				delete resultCopy.password
				delete resultCopy.user_pic

				// 生成token
				const tokenStr = jwt.sign(resultCopy, config.jwtSecretKey, {expiresIn: config.expiresIn})
				res.success({
					// info: resultCopy,
					token: tokenStr
				}, '登陆成功')
			}
		}
	})
}

