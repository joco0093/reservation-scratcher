import express from 'express';
const app = express();

import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/"));


// login page
app.get('/', function(req, res) {
	res.render('frontend',{
		local_css:"signin.css",
		my_title:"Login Page"
	});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT);
console.log("test");
