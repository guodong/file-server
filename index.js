var express = require('express')
var multer = require('multer')
var shortid = require('shortid')
var cors = require('cors')
var fs = require('fs')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data/')
  },
  filename: function (req, file, cb) {
    var ext = 'jpg'
    if (file.originalname.lastIndexOf('.') !== -1) {
      ext = file.originalname.substring(file.originalname.lastIndexOf('.') + 1)
    }
    cb(null, shortid.generate() + '.' + ext)
    //cb(null, shortid.generate()+'.' + file.originalname)

  }
})

var upload = multer({ storage: storage })
var app = express()
var domain = process.env.DOMAIN || ''

//app.use(cors())
app.all('/*', function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,OPTION,DELETE');
  //res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

app.post('/:file', upload.single('file'), function (req, res, next) {
  res.header("Content-Type", "text/html");
  console.log(req.body.domain);
  var domain = req.domain,
    script = '<script type="text/javascript">document.domain = "' + req.body.domain + '";</script>',
    body = '<body>' + JSON.stringify({ url: ( process.env.DOMAIN || '') + '/' + req.file.filename }) + '</body>';

  res.end('<html><head>' + script + '</head>' + body + '</html>');

});

app.get('/', function (req, res) {
  res.send({ result: "Hello World" });
})


app.get('/:file', function (req, res) {
  if (fs.existsSync('data/' + req.params.file)) {
    res.sendFile(__dirname + '/data/' + req.params.file);
  } else {
    res.status(404).end()
  }
})

app.listen(80)
