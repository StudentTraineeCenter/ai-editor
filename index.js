const express = require("express");
const cors = require("cors");
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

app.use(express.static('views'));
/*
app.use(
    cors({
      origin: "https://related-pics.now.sh"
    })
  );
*/
app.get("/", function(req, res) {
    res.render("index");
});
app.get("/analyze", function(req, res) {
    const analyze = require("./analyze");
    res.render("analyze", {returnStuff: analyze.do("This is a Hello World template for GCP, Azure, Watson and AWS")});
});
app.listen(5000, function() {
    console.log(`Related Pics listening on port ${5000}!`);
  });