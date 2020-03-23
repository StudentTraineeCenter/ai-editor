const express = require("express");
const cors = require("cors");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(express.static("views"));

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

  function boldenKeyphrases(text, phrases) {
    var finalText = text;
    phrases.forEach(keyword => {
      finalText = finalText.replace(keyword, `<strong>${keyword}</strong>`);
    });
    return finalText;
  }

  function encodeHTML(text) {
    text = text.replace(new RegExp(/</gi), "&lt;");
    text = text.replace(new RegExp(/>/gi), "&gt;");
    return text;
  }
  function GetAnalyzed(txt) {
    "use strict";
    const textAnalyticsClient = new TextAnalyticsClient(
      credentials.creds.endpoint,
      new TextAnalyticsApiKeyCredential(credentials.creds.key)
    );
    async function linkedEntityRecognition(client) {
      const linkedEntityInput = [encodeHTML(txt)];
      const entityResults = await client.recognizeLinkedEntities(
        linkedEntityInput
      );
      const keyPhraseResult = await client.extractKeyPhrases(linkedEntityInput);

        console.log(keyPhraseResult)
      entityResults.forEach(document => {
        document.entities.forEach(entity => {
          entity.matches.forEach(match => {
            return txt.substr(match.offset, match.length + match.offset);
          });
        });
      });
      res.render("analyze", { returnStuff: entityResults[0].entities, returnText: boldenKeyphrases(encodeHTML(txt), keyPhraseResult[0].keyPhrases) });
    }

    linkedEntityRecognition(textAnalyticsClient);
  }
  const reply = GetAnalyzed(
   req.query.txt || "This is a Hello World template for GCP, Azure, Watson and AWS"
  );
});
app.listen(5000, function() {
  console.log(`Related Pics listening on port ${5000}!`);
});
