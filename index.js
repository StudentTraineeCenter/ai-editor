const express = require("express");
const cors = require("cors");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(express.static("views"));
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

  const {
    TextAnalyticsClient,
    TextAnalyticsApiKeyCredential
  } = require("@azure/ai-text-analytics");
  const credentials = require("./creds.js");

  function encodeHTML(text) {
    text = text.replace("<", "&lt;");
    text = text.replace(">", "&gt;");
    return text;
  }
  function GetAnalyzed(txt) {
    "use strict";
    const textAnalyticsClient = new TextAnalyticsClient(
      credentials.creds.endpoint,
      new TextAnalyticsApiKeyCredential(credentials.creds.key)
    );
    async function linkedEntityRecognition(client) {
      const linkedEntityInput = [txt];
      const entityResults = await client.recognizeLinkedEntities(
        linkedEntityInput
      );

      entityResults.forEach(document => {
        document.entities.forEach(entity => {
          console.log(`URL: ${entity.url}`);
          entity.matches.forEach(match => {
            return txt.substr(match.offset, match.length + match.offset);
          });
        });
      });
      console.log(entityResults[0].entities);
      res.render("analyze", { returnStuff: entityResults[0].entities[1].url });
    }

    linkedEntityRecognition(textAnalyticsClient);
  }
  const reply = GetAnalyzed(
    "This is a Hello World template for GCP, Azure, Watson and AWS"
  );
});
app.listen(5000, function() {
  console.log(`Related Pics listening on port ${5000}!`);
});
