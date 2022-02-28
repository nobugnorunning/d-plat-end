const sql = require('../db/mysql')
const multiparty = require('multiparty')
const path = require('path')
const fs = require('fs')

// 获取文章分类
exports.getArticleCate = (req, res) => {
	sql.query(
		'select cate_id,name,alias,update_time from ev_article_cate where is_delete=0',
		(e, r) => {
			if(!e) {
				res.success(r, '获取文章分类成功')
			}else {
				res.fail(e)
			}
		}
	)
}

// 新增文章分类
exports.addArticleCate = (req, res) => {
	sql.query(
		'select * from ev_article_cate where name=? or alias=?',
		[req.body.name, req.body.alias],
		(e, r) => {
			// 先检查分类的名字和别名是否被占用
			if(r.length === 1){
				if(r[0].name === req.body.name) return res.fail("分类名被占用")
				if(r[0].alias === req.body.alias) return res.fail("别名被占用")
			}else if(r.length === 2){
				return res.fail("分类名和别名都被占用了")
			}
			if(!e){
				// 新增到数据库里
				sql.query(
					'insert into ev_article_cate set ?',
					[
						{
							name: req.body.name,
							alias: req.body.alias,
							is_delete: 0
						}
					],
					(error, result) => {
						if(!error){
							if(result.affectedRows !== 1){
								res.fail(error)
							}else {
								res.success("OK", '添加分类成功')
							}
						}else{
							res.fail(error)
						}
					}
				)
			}else {
				res.fail(e)
			}
		}
	)
}

// 根据id删除文章分类
exports.deleteArticleCate = (req, res) => {
	sql.query(
		'update ev_article_cate set is_delete=1 where cate_id=?',
		[req.body.cate_id],
		(e, r) => {
			if(!e){
				if(r.affectedRows === 1){
					res.success("OK", '删除成功')
				}else {
					res.fail(e, '删除失败')
				}
			}else {
				res.fail(e)
			}
		}
	)
}

// 根据id修改文章分类
exports.updateArticleCate = (req, res) => {
	// 先根据id查询分类
	sql.query(
		'select cate_id,name,alias,update_time from ev_article_cate where is_delete=0 and cate_id=?',
		[req.body.cate_id],
		(e, r) => {
			if(!e){
				if(r.length <= 0) return res.fail('文章分类不存在')
				// 修改文章分类
				sql.query(
					`update ev_article_cate set ? where cate_id=?`,
					[
						{
							name: req.body.name ? req.body.name : r[0].name,
							alias: req.body.alias ? req.body.alias : r[0].alias
						},
						req.body.cate_id
					],
					(err, result) => {
						if(err) return res.fail(err)
						if(result.affectedRows === 1) res.success("OK", "修改文章分类成功")
					}
				)
			}else {
				res.fail(e)
			}
		}
	)
}

// 发布文章（存草稿）
exports.pubArticleCate = (req, res) => {
	const form = new multiparty.Form(),
		uploadPath = path.join(__dirname, '../static/uploads')
	form.encoding = 'utf-8'
	form.uploadDir = uploadPath
	form.parse(req, (err, fields, files) => {
		if(files['cover_img'] && files['cover_img'].length > 0){
			const time_stamp = Date.now()
			fs.rename(files['cover_img'][0].path, `${uploadPath}/${time_stamp}.${files['cover_img'][0].originalFilename}`, err => {
				if(err) return res.fail(err)
			})
			// 手动校验数据是否为空
			for(let key in fields){
				fields[key] = fields[key][0]
			}
			const params = [
				'aut_id',
				'cate_id',
				'title',
				'content',
				'state'
			]

			for(item in params){
				if(!fields[params[item]] || fields[params[item]].length <= 0) {
					return res.fail(item + '不能为空')
				}
			}

			// 检查分类id存不存在
			sql.query(
				'SELECT * from ev_article_cate where cate_id=?',
				[fields.cate_id],
				(err, result) => {
					if(err) return res.fail(err)
					if(result.length === 1){
						// 插入到新文章列表
						sql.query(
							'insert into ev_articles set ?',
							[
								{
									...fields,
									cover_img: time_stamp + '.' + files['cover_img'][0].originalFilename,
									is_delete: 0,
									cate_name: result[0].name,
									cate_alias: result[0].alias
								}
							],
							(e, r) => {
								if(!e){
									if(r.affectedRows === 1){
										res.success("OK", '发布文章成功')
									}
								}else {
									res.fail(e)
								}
							}
						)
					}else {
						res.fail('分类不存在')
					}
				}
			)
		}else {
			res.fail('请上传封面')
		}
	})
}

// 获取文章列表（我的）
exports.getAllArticles = (req, res) => {
	sql.query(
		`
			select art_id, aut_id, cate_id, title, content, cover_img, pub_date, state
			from ev_articles where aut_id=? and is_delete=0 order by pub_date desc
		`,
		[req.user.id],
		(e, r) => {
			if(e) return res.fail(e)
			res.success(r, '获取我的文章成功')
		}
	)
}

// 删除我的文章
exports.deleteMyArticle = (req, res) => {
	if(!req.body.art_id) return res.fail('ari_id不能为空')
	sql.query(
		'update ev_articles set ? where art_id=?',
		[
			{is_delete: 1},
			req.body.art_id
		],
		(e, r) => {
			if(e) return res.fail(e)
			if(r.affectedRows === 1){
				res.success('OK', '删除文章成功')
			}else {
				res.fail('文章不存在')
			}
		})
}

// 修改我的文章
exports.updateMyArticle = (req, res) => {
	res.send('ok')
}
