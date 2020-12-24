import express from 'express';
const app = express();

// set the view engine to ejs
app.set('view engine', 'ejs');
// app.use(static(__dirname + '/'));//This line is necessary for us to use relative paths and access our resources directory


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
