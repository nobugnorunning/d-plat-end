const sql = require('../db/mysql')
const bcrypt = require('bcryptjs')

// 获取用户信息
exports.getUserInfo = (req, res) => {
	// 根据用户的id获取用户信息
	// req.user 是 token 解析成功后 express-jwt 帮我们挂载上去的
	sql.query(
		'SELECT id,username,nickname,user_pic,email,is_admin,roles from ev_user where id=?',
		[req.user.id],
		(e, r) => {
			if (!e) {
				// 查询成功
				if (r.length !== 1) return res.fail(e, '获取用户信息失败')
				res.success(r[0], '获取用户信息成功')
			} else {
				res.fail(e)
			}
		})
}

// 更新用户信息
exports.updateUserInfo = (req, res) => {
	// 先查询该用户存不存在
	const userinfo = req.body
	sql.query(
		'select * from ev_user where id=?',
		[req.user.id],
		(err, result) => {
			if(!err) {
				// 如果查到了就去修改
				sql.query(
					'update ev_user set ? where id=?',
					[
						{
							nickname: userinfo.nickname ? userinfo.nickname : result[0].nickname,
							username: userinfo.username ? userinfo.username : result[0].username,
							email: userinfo.email ? userinfo.email : result[0].email,
							// user_pic: userinfo.user_pic ? userinfo.user_pic : result[0].user_pic,
						},
						req.user.id
					],
					(e, r) => {
						if(!e){
							if(r.affectedRows === 1){
								res.success({}, '修改成功')
							}else {
								res.fail(err, '修改失败')
							}
						}else {
							res.fail(e)
						}
					})
			}else {
				res.fail(err)
			}
		})
}

exports.updatePwd = (req, res) => {
	sql.query(
		'SELECT * from ev_user where id=?',
		[req.user.id],
		(e, r) => {
			if(!e){
				if(r.length !== 1) return res.fail(e)
				// 将用户传递的原密码跟数据库内进行比较
				const compareRes = bcrypt.compareSync(req.body.oldpwd, r[0].password)
				if(compareRes) {
					// 原密码正确就要修改用户的密码了
					// 检查一下两次输入密码是不是一致
					if(req.body.newpwd === req.body.repwd){
						// 更新密码
						const salt = bcrypt.genSaltSync(10)
						const newPwd = bcrypt.hashSync(req.body.newpwd, salt)
						sql.query(
							'update ev_user set? where id=?',
							[
								{password: newPwd},
								req.user.id
							],
							(error, result) => {
								if(!error){
									result.affectedRows === 1 && res.success("OK")
								}else {
									res.fail(error)
								}
							}
						)
					}else {
						res.fail(e, '两次密码输入不一致')
					}
				}else {
					res.fail(e, '原密码不正确')
				}
			}else {
				res.fail(e)
			}
		})
}

exports.updateAvatar = (req, res) => {
	// 更新用户的头像
	sql.query(
		'update ev_user set ? where id=?',
		[
			{user_pic: req.body.avatar},
			req.user.id
		],
		(e, r) => {
			if(!e){
				if (r.affectedRows === 1){
					res.success('OK', '更新头像成功')
				}else {
					res.fail(e, '更新头像失败')
				}
			}else {
				res.fail(e)
			}
		}
	)
}

