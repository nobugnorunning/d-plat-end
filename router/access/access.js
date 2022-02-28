const router = require('express').Router()
const sql = require('../../db/mysql')
const expressJoi = require('@escook/express-joi')
const {addRoles_schema} = require('../../schema/access')

// 角色列表
router.get('/roles/list', (req, res) => {
	res.send('/ok')
})

// 新增角色列表
router.post('/roles/add', expressJoi(addRoles_schema), (req, res) => {
	const body = req.body
	console.log(body)
	sql.query(
		`
			select role_name from ev_roles where role_name = ?
		`,
		body.role_name,
		(err, result) => {
			if(err) return res.fail(err)
			if(result.length > 0){
				return res.fail("角色名重复")
			}
			sql.query(
				`
						insert into ev_roles set ?
					`,
				[
					Object.assign({}, body, {role_access: JSON.stringify(body.role_access)})
				],
				(e, r) => {
					if(e) return res.fail(e)
					if(r.affectedRows !== 1){
						return res.fail('新增角色失败')
					}
					res.success('新增角色成功')
				}
			)
		}
	)
})


// 查询一级权限列表
router.get('/roles/access/list', (req, res) => {
	sql.query(
		`
			select * from ev_access
		`,

	)
})

module.exports = router
