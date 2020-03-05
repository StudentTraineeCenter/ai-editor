const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.static('views'));
app.use(
    cors({
      origin: "https://related-pics.now.sh"
    })
  );
app.get("/", function(req, res) {
    res.render("/views/index.html");
});
app.get("/analyze", function(req, res) {
    const analyze = require("./analyze");
    analyze.do();
});
app.listen(5000, function() {
    console.log(`Related Pics listening on port ${5000}!`);
  });