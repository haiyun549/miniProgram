const request = require('request');
const querystring = require('querystring');
//调用文件
const system = require('./system.js');

//数据库信息
const pool = system.pool;

function getOpenId(req, res){
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
}

function getHome(req,res) {
    pool.getConnection(function (err, connection) {
        console.log(req.query)
        let uid = req.query.uid;
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
                //查knowledge左连接uid的fondCollect
                sql = "select knowledge.*,IFNULL(uid,"+uid+") as uid,IFNULL(fond,0) as fond,IFNULL(collect,0) as collect,tap_time from knowledge left join (select * from fondCollect where uid = "+uid+") as ufond on knowledge.id = ufond.kid"
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
}

function getMyCollectView(req,res){
    pool.getConnection(function (err, connection) {
        let uid = req.query.uid;
        let type = req.query.type;
        let sql = "";
        if(type == "我的收藏"){
            sql = "select knowledge.*,uid,fond,collect,tap_time from knowledge left join fondCollect on knowledge.id = fondCollect.kid where uid = "+uid+" and collect = 1";
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
            });
        }
        else if(type == "浏览历史"){
            sql = "select knowledge.*,uid,fond,collect,tap_time from knowledge left join fondCollect on knowledge.id = fondCollect.kid where uid = "+uid+" order by tap_time desc";
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
            });
        }
        connection.release();
    });
}

function getKnowledge(req,res){
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
}

exports.getOpenId = getOpenId;
exports.getHome = getHome;
exports.getKnowledge = getKnowledge;
exports.getMyCollectView = getMyCollectView;
