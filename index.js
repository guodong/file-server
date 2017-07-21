var express = require('express')
var multer  = require('multer')
var shortid = require('shortid')
var cors = require('cors')
var fs = require('fs')

app.use(cors())

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'data/')
  },
  filename: function (req, file, cb) {
    var ext = 'jpg'
    if (file.originalname.lastIndexOf('.') !== -1) {
	  ext = file.originalname.substring(file.originalname.lastIndexOf('.') + 1)
	}
    cb(null, shortid.generate()+'.' + ext)
  }
})

var upload = multer({ storage: storage })
var app = express()
var domain = process.env.DOMAIN || ''

app.post('/', upload.single('file'), function (req, res, next) {
  console.log(req.file.filename)
  res.end(domain + '/' + req.file.filename)
})

app.get('/:file', function (req, res){
  if (fs.existsSync('data/' + req.params.file)) {
	res.sendFile(__dirname + '/data/' + req.params.file);
  } else {
	res.status(404).end()
  }
})

app.listen(80)
