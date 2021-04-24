const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
//调用文件
const system = require('./system.js')
const get = require('./get.js');
const tap = require('./tap.js')

app.use(bodyParser.json({limit: '1mb'}));  //body-parser 解析json格式数据
app.use(bodyParser.urlencoded({            //此项必须在 bodyParser.json 下面,为参数编码
    extended: true
}));

// 配置 https
const httpsOption = system.httpsOption;

//解决跨域问题
app.all('*', system.AC);

app.post('/getOpenId',get.getOpenId);
app.get('/getHome',get.getHome);
app.get('/getKnowledge',get.getKnowledge);
app.get('/getMyCollectView',get.getMyCollectView);
app.get('/tapFond',tap.tapFond);
app.get('/tapCollect',tap.tapCollect);


//配置服务端口80 443
const server = app.listen(80, function () {
    const port = server.address().port;
    console.log('App listening at %s', port);
});

https.createServer(httpsOption, app).listen(443);