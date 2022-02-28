const sql = require('../../db/mysql')

// 新增分类
exports.addCate_handler = (req, res) => {
	// 需要判断添加的是哪一级的分类
	// 分类总共三级
	// 添加根分类（type为0）
	// 分类名、type为必传
	// 当type不是0 的时候，parent_id必传
	const params = req.body

	const sql_handler = (e, r) => {
		if(e) return res.fail(e)
		if(r.affectedRows == 1){
			res.success("新增分类成功")
		}else {
			res.fail("新增分类失败")
		}
	}
	console.log(req.body)

	if(params.type == 0){
		// 添加根分类
		sql.query(
			`
				insert into ev_goods_cate (parent_id, label, type) values (?, ?, ?)
			`,
			[0, params.label, 0],
			sql_handler
		)
	}else {
		// 添加子分类
		/**
		 * @param: parent_id 父分类id
		 * @param: type 分类层级，如果是三级的分类，父级必须是二级的
		 */
		if(params.type == 1){
			// 二级分类
			// 检测有没有传父级id
			if(params.parent_id){
				// 检测父级id是不是一级的
				sql.query('select type from ev_goods_cate where id = ?',
					[params.parent_id],
					(e, r) => {
					if(e) return res.fail(e)
						if(r.length > 0){
							if(r[0].type == 0){
								sql.query(
									`
										insert into ev_goods_cate (parent_id, label, type) values (?,?,?)
									`,
									[params.parent_id, params.label, 1],
									sql_handler
								)
							}else {
								res.fail("二级分类的父级必须是一级")
							}
						}else {
							res.fail('父级分类不存在')
						}
					})

			}else {
				res.status(400).fail("parent_id不能为空")
			}
		}else {
			// 三级分类
			if(params.parent_id){
				// 查询parent_id是不是二级
				sql.query(
					`
						select type from ev_goods_cate where id=?
					`,
					[params.parent_id],
					(e, r) => {
						if(e) return res.fail(e)
						if(r.length > 0){
							if(r[0].type === 1){
								sql.query(
									`
										insert into ev_goods_cate (parent_id, label, type) values (?,?,?)
									`,
									[params.parent_id, params.label, 2],
									sql_handler
								)
							}else {
								res.fail("三级分类的父级必须是二级")
							}
						}else {
							res.fail("父级分类不存在")
						}
					}
				)


			}else {
				res.status(400).fail("parent_id不能为空")
			}
		}
	}
}

// 查询分类
exports.getCate_handler = (req, res) => {
	function treeData_handler(arr1, arr2, arr3){
		let array = []
		if(arr3){
			// 处理三层数据
			// TODO 待优化
			arr1.forEach(item => {
				item.children = []
				arr2.forEach(val => {
					val.children = []
					arr3.forEach(v => {
						if(v.parent_id === val.id){
							val.children.push(v)
						}
					})
					if(val.parent_id === item.id){
						item.children.push(val)
					}
				})
				array.push(item)
			})
		}else {
			// 处理两层数据
			arr1.forEach(item => {
				item.children = []
				arr2.forEach(val => {
					if(val.parent_id === item.id){
						item.children.push(val)
					}
				})
				array.push(item)
			})
		}
		return array
	}

	/**
	 * @params {cascade: 级联} 不传或者3就是查询所有，1是查询一级，2是查询两级
	 */
	console.log(req.body)
	// 所有
	sql.query(
		`
			select * from ev_goods_cate
		`,
		(e, r) => {
			if(e) res.fail(e)
			let list1 = r.filter(x => x.type == 0)
			let list2 = r.filter(x => x.type == 1)
			let list3 = r.filter(x => x.type == 2)
			if(req.body.cascade == 1){
				res.success(list1)
			}else if(req.body.cascade == 2){
				const data = treeData_handler(list1, list2)
				res.success(data)
			}else if(!req.body.cascade || req.body.cascade == "3"){
				const data = treeData_handler(list1, list2, list3)
				res.success(data)
			}else {
				res.fail("cascade error")
			}
		}
	)
}

// 根据id查询子分类
exports.getCateById_handler = (req, res) => {
	const id = req.body.id
	if(!id) return res.fail("分类id不能为空")
	sql.query(
		'select * from ev_goods_cate where parent_id=?',
		id,
		(e, r) => {
			if(e) return res.fail(e)
			if(r.length > 0){
				res.success(r)
			}else {
				res.fail("未查询到分类")
			}
		}
	)
}
