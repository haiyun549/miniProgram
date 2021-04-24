const request = require('request');
const querystring = require('querystring');
//调用文件
const system = require('./system.js');

//数据库信息
const pool = system.pool;

function tapFond(req,res){
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
}

function tapCollect(req,res){
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
}

exports.tapFond = tapFond;
exports.tapCollect = tapCollect;