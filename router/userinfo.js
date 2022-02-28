const router = require('express').Router();
const {getUserInfo, updateUserInfo, updatePwd, updateAvatar, getUsersList} = require('../router_handler/userinfo')
const {resetPwd_schema} = require('../schema/userinfo')
const {avatar_schema} = require('../schema/user')
const expressJoi = require('@escook/express-joi')

// 获取用户信息
router.get('/userinfo', getUserInfo)

// 更新用户信息
router.post('/userinfo/update', updateUserInfo)

// 更新用户密码
router.post('/userinfo/updatepwd', expressJoi(resetPwd_schema), updatePwd)

// 更新用户头像
router.post('/userinfo/avatar', expressJoi(avatar_schema), updateAvatar)

module.exports = router
