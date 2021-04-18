const express = require('express');
const mysql = require("mysql");
const app = express();
const bodyParser = require("body-parser");
const request = require('request');
const querystring = require('querystring');
let https = require("https");
let fs = require("fs");

app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
    extended: true
}));

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
app.all('*', function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});

app.post('/getopenid', (req, res) => {
    const data = {
        'appid': 'wxc1182bf91f961ec9',
        'secret': '2cdc643936e6d8a8fca0fc44cd950dc2',
        'js_code': req.body.code,
        'grant_type': 'authorization_code'
    };
    // console.log(data);
    // querystring的stringify用于拼接查询
    const content = querystring.stringify(data);
    // 根据微信开发者文档给的API
    const url = 'https://api.weixin.qq.com/sns/jscode2session?' + content;
    // 对url发出一个get请求
    request.get({
        'url': url
    }, (error, response, body) => {
        // 将body的内容解析出来
        let result = JSON.parse(body);
        result.code = req.body.code;
        let openid = result.openid
        // console.log(result)
        //1.查数据库
        //2.判断openid是否存在
        //3.如果存在，则将对应信息返回给小程序端
        //4.否则，新插入记录到数据库，并将结果返回到小程序端
        pool.getConnection(function (err, connection){
            let sql = "select * from userinfo where openid='"+openid+"'";
            console.log(sql);
            connection.query(sql, function (err, rows){
                if(err){
                    throw err;
                }else{
                    //有openid则返回
                    if(rows.length>0){
                        let result = {
                            "status":"200",
                            "success":true
                        }
                        result.userid=rows[0].id;
                        console.log(rows);
                        res.json(result);
                    }else{
                        //插入一条记录
                        sql = "insert into userinfo (openid) values ('"+openid+"')";
                        console.log(sql);
                        connection.query(sql, function (err, rows) {
                            if (err) {
                                throw err;
                            } else {
                                let result={
                                    "status":"200",
                                    "success":true
                                }
                                result.userid = rows.insertId;
                                console.log(rows);
                                res.json(result);
                            }
                        });
                    }
                }
            });
            connection.release();
        })
    })
})

app.get('/getHome',function(req,res) {
    pool.getConnection(function (err, connection) {
        //查swiper的img
        let sql = "select * from swiper";
        console.log(sql);
        connection.query(sql, function (err, rows) {
            if (err) {
                throw err;
            } else {
                let result = {
                    "status": "200",
                    "success": true
                }
                result.swiper = rows;
                console.log(result.swiper);
                //查knowledge左连接fondCollect
                sql = "select knowledge.*,IFNULL(fondCollect.fond,0) as fond,IFNULL(fondCollect.collect,0) as collect from knowledge left join fondCollect on knowledge.id = fondCollect.kid";
                console.log(sql);
                connection.query(sql, function (err, rows) {
                    if (err) {
                        throw err;
                    } else {
                        result.knowledge = rows;
                        console.log(result.knowledge);
                        res.json(result);
                    }
                })
            }
        })
        connection.release();
    })
})

app.get('/getKnowledge',function(req,res){
    pool.getConnection(function (err, connection){
        let uid = req.query.uid;
        let kid = req.query.kid;
        //改knowledge中view_num+1
        let sql = "update knowledge set view_num = view_num+1 where id = "+kid;
        console.log(sql);
        connection.query(sql, function (err, rows) {
            if (err) {
                throw err;
            }else{
                //查fondCollect中uid,kid的tap_time
                let sql = "select * from fondCollect where uid = "+uid+" and kid = "+kid;
                console.log(sql);
                connection.query(sql, function (err, rows) {
                    if (err) {
                        throw err;
                    } else {
                        if (rows.length > 0) {//有uid和kid则改fondCollect的tap_time
                            sql = "update fondCollect set tap_time = now() where uid = "+uid+" and kid = "+kid;
                            console.log(sql);
                            connection.query(sql, function (err, rows) {
                                if (err) {
                                    throw err;
                                }else{
                                    //查uid和kid的knowledge左连接fondCollect，返回文章信息
                                    sql = "select * from knowledge left join fondCollect on knowledge.id = kid where uid = "+uid+" and kid = "+kid;
                                    // sql = "select * from (select knowledge.id as kid,knowledge.*,IFNULL(uid,"+uid+") as uid,IFNULL(fondCollect.fond,0) as fond,IFNULL(fondCollect.collect,0) as collect from knowledge left join fondCollect on knowledge.id = kid) as ukfond where uid = "+uid+" and kid = "+kid;
                                    console.log(sql);
                                    connection.query(sql, function (err, rows) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            let result = {
                                                "status": "200",
                                                "success": true
                                            }
                                            result.knowledge = rows;
                                            console.log(result.knowledge);
                                            res.json(result);
                                        }
                                    })
                                }
                            })
                        } else {//没有uid和kid则增fondCollect
                            //增fondCollect中uid,kid
                            sql = "insert into fondCollect (uid, kid) values (" + uid + ", " + kid + ")";
                            console.log(sql);
                            connection.query(sql, function (err, rows) {
                                if (err) {
                                    throw err;
                                }else{
                                    //查uid和kid的knowledge左连接fondCollect，返回文章信息
                                    sql = "select * from knowledge left join fondCollect on knowledge.id = kid where uid = "+uid+" and kid = "+kid;
                                    // sql = "select * from (select knowledge.id as kid,knowledge.*,IFNULL(uid,"+uid+") as uid,IFNULL(fondCollect.fond,0) as fond,IFNULL(fondCollect.collect,0) as collect from knowledge left join fondCollect on knowledge.id = kid) as ukfond where uid = "+uid+" and kid = "+kid;
                                    console.log(sql);
                                    connection.query(sql, function (err, rows) {
                                        if (err) {
                                            throw err;
                                        } else {
                                            let result = {
                                                "status": "200",
                                                "success": true
                                            }
                                            result.knowledge = rows;
                                            console.log(result.knowledge);
                                            res.json(result);
                                        }
                                    })
                                }
                            });
                        }
                    }
                })
            }
        })
        connection.release();
    })
});

app.get('/tapFond',function(req,res){
    pool.getConnection(function (err, connection){
        let uid = req.query.uid;
        let kid = req.query.kid;
        //查fondCollect中uid和kid的fond
        let sql = "select fond from fondCollect where uid = "+uid+" and kid = "+kid;
        console.log(sql);
        connection.query(sql, function (err, rows) {
            if (err) {
                throw err;
            }else{
                let fond = rows[0].fond;
                if(fond == 0){
                    fond = 1;
                }else{
                    fond = 0;
                }
                //改fondCollect中uid，kid的fond
                sql = "update fondCollect set fond = "+fond+" where uid = "+uid+" and kid = "+kid;
                console.log(sql);
                connection.query(sql, function (err, rows) {
                    if (err) {
                        throw err;
                    }else{
                        //改knowledge的fond_num为fondCollect指定kid的fond总和
                        sql = "update knowledge set fond_num = (select sum(fond) from fondCollect where kid = "+kid+") where id = "+kid;
                        console.log(sql);
                        connection.query(sql, function (err, rows) {
                            if (err) {
                                throw err;
                            }else{
                                //查uid和kid的knowledge左连接fondCollect
                                sql = "select * from knowledge left join fondCollect on knowledge.id = kid where uid = "+uid+" and kid = "+kid;
                                // sql = "select knowledge.*,IFNULL(fondCollect.fond,0) as fond,IFNULL(fondCollect.collect,0) as collect from knowledge left join fondCollect on knowledge.id = fondCollect.kid where fondCollect.uid = "+uid+" and kid = "+kid;
                                console.log(sql);
                                connection.query(sql, function (err, rows) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        let result = {
                                            "status": "200",
                                            "success": true
                                        }
                                        result.knowledge = rows;
                                        console.log(result.knowledge);
                                        res.json(result);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
        connection.release();
    })
});

app.get('/tapCollect',function(req,res){
    pool.getConnection(function (err, connection){
        let uid = req.query.uid;
        let kid = req.query.kid;
        // let data = JSON.parse(req.query.data);
        // let collect = data.collect;
        //查fondCollect中uid和kid的collect
        let sql = "select collect from fondCollect where uid = "+uid+" and kid = "+kid;
        console.log(sql);
        connection.query(sql, function (err, rows) {
            if (err) {
                throw err;
            }else{
                let collect = rows[0].collect;
                if(collect === 0){
                    collect = 1;
                }else{
                    collect = 0;
                }
                //update
                sql = "update fondCollect set collect = "+collect+" where uid = "+uid+" and kid = "+kid;
                console.log(sql);
                connection.query(sql, function (err, rows) {
                    if (err) {
                        throw err;
                    }else{
                        //改knowledge的collect_num为fondCollect指定kid的collect总和
                        sql = "update knowledge set collect_num = (select sum(collect) from fondCollect where kid = "+kid+") where id = "+kid;
                        console.log(sql);
                        connection.query(sql, function (err, rows) {
                            if (err) {
                                throw err;
                            }else{
                                //查uid和kid的knowledge左连接fondCollect
                                sql = "select * from knowledge left join fondCollect on knowledge.id = kid where uid = "+uid+" and kid = "+kid;
                                // sql = "select knowledge.*,IFNULL(fondCollect.fond,0) as fond,IFNULL(fondCollect.collect,0) as collect from knowledge left join fondCollect on knowledge.id = fondCollect.kid where fondCollect.uid = "+uid+" and kid = "+kid;
                                console.log(sql);
                                connection.query(sql, function (err, rows) {
                                    if (err) {
                                        throw err;
                                    } else {
                                        let result = {
                                            "status": "200",
                                            "success": true
                                        }
                                        result.knowledge = rows;
                                        console.log(result.knowledge);
                                        res.json(result);
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
        connection.release();
    })
});

//配置服务端口80 443
const server = app.listen(80, function () {
    const port = server.address().port;
    console.log('App listening at %s', port);
});

https.createServer(httpsOption, app).listen(443);