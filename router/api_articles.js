const router = require('express').Router();
const sql = require('../db/mysql')
const url = require('url');

router.get('/articles', (req, res) => {
	let params = url.parse(req.url).query;
	var obj = {}
	params.split('&').forEach(item => {
		for (let key in item.split('=')) {
			obj[item.split('=')[0]] = item.split('=')[1]
		}
	})
	params = obj
	console.log(params)
	if (!params.pagenum && params.pagenum > 0) {
		return res.fail('pagenum cannot be empty or cannot be zero')
	} else if (!params.pagesize) {
		return res.fail('pagesize cannot be empty')
	}
	const limit = (params.pagenum - 1) * params.pagesize
	let str = 'select count(*) from ev_articles'
	if (params.state && (params.state == 1 || params.state == 2)) {
		str = `
			select count(*) from ev_articles where is_delete=0 and state='${params.state}'
			`
	}
	sql.query(
		str,
		(error, results) => {
			if (error) return res.fail(error)
			let count = results[0]['count(*)']
			let sqlStr = ''
			if (params.state && (params.state == 1 || params.state == 2)) {
				sqlStr = `
					select
						art_id,title,content,aut_id,cate_id,cate_name,cate_alias,cover_img,state,pub_date
					from ev_articles where is_delete=0 and state='${params.state}' order by pub_date desc limit ${limit}, ${params.pagesize}
					`
			} else {
				sqlStr = `
					select
						art_id,title,content,aut_id,cate_id,cate_name,cate_alias,cover_img,state,pub_date
					from ev_articles where is_delete=0 order by pub_date desc limit ${limit}, ${params.pagesize}
					`
			}
			sql.query(
				sqlStr,
				(err, result) => {
					if (err) return res.fail('获取文章列表失败')
					res.success({
						count,
						pagenum: params.pagenum - 0,
						pagesize: params.pagesize - 0,
						data: result
					}, '获取文章列表成功')
				}
			)
		}
	)
})

module.exports = router
