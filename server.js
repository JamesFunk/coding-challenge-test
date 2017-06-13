const express = require('express');
const app = express();
const path = require('path');

// app.use(epxress.static('bower_components'));
app.use('/public', express.static('public'));
app.use('/bc', express.static('bower_components'));
app.use('/templates', express.static('templates'));

app.get('/', function (req, res) {
	res.sendFile(path.join(__dirname + '/templates/index.html'));
});

app.listen(process.env.PORT || 3000, function () {
	console.log('Example app listening on port 3000!')
});