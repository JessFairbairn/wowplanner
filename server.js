const express = require('express');
const bodyParser = require("body-parser");
const app = express();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname /*+ '/public'*/));

//setting up bodyParser for post requests
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// views is directory for all template files
app.set('views', __dirname/* + '/views'*/);
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

app.post('/login',function(req,res){
  var user_name=req.body.user;
  var password=req.body.password;
  console.log("User name = "+user_name+", password is "+password);
  res.end("yes");
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});