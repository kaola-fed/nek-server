var static = require('koa-static');
var koa = require('koa');
var router = require('koa-router')();
var app = koa();

app.use(static(__dirname + '/public'));

router.get('/', function *(next) {
  this.body = 'Hello NEK';
})
app.use(router.routes())

app.listen(3000);