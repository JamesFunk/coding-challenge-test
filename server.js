const express = require('express');
const app = express();
const path = require('path');

app.set('view engine', 'html');

app.use('/public', express.static('app'));
app.use('/bc', express.static('bower_components'));
app.use('/styles', express.static('styles'));
app.use('/partials', express.static('templates/partials'));

app.get('/*', function (req, res) {
	res.sendFile(path.join(__dirname + '/templates/index.html'));
});

app.listen(process.env.PORT || 3000, function () {
	console.log('Example app listening on port 3000!')
});