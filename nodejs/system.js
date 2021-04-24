const mysql = require("mysql");
const fs = require("fs");

const pool = mysql.createPool({
    host: 'localhost',
    port: 3306,
    database: 'test',
    user: 'test',
    password: 'h1261366239'
});

// 配置 https
const httpsOption = {
    key : fs.readFileSync("./https/5424593_haiyun.luzhenmin.com.key"),
    cert: fs.readFileSync("./https/5424593_haiyun.luzhenmin.com.pem")
}

//解决跨域问题
function AC(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
}

exports.pool = pool;
exports.httpsOption = httpsOption;
exports.AC = AC;