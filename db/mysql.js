const mysql = require('mysql')

const conn = mysql.createPool({
	host: '124.223.31.209',
	user: 'root',
	password: 'djldjl',
	database: 'api_server'
})

module.exports = conn
