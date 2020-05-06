const express = require("express");
const app = express(); // express init

const port = process.env.PORT || 5000;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.use(express.static("views"));
app.use(express.static("assets"));

app.get("/analyze", function (req, res) {
  res.render("index");
});

app.get("/", function (req, res) {
  const {
    TextAnalyticsClient,
    TextAnalyticsApiKeyCredential,
  } = require("@azure/ai-text-analytics");

  let key, endpoint;

  if (typeof process.env.endpoint != "undefined") {
    key = process.env.key;
    endpoint = process.env.endpoint;
  } else {
    key = require("./creds.js").creds.key;
    endpoint = require("./creds.js").creds.endpoint;
  }

  function boldenKeyphrases(text, phrases) {
    var finalText = text;
    phrases.forEach((keyword) => {
      finalText = finalText.replace(
        keyword,
        `<span style="font-weight: bold;">${keyword}</span>`
      );
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
      endpoint,
      new TextAnalyticsApiKeyCredential(key)
    );
    async function linkedEntityRecognition(client) {
      const linkedEntityInput = [encodeHTML(txt)];
      const entityResults = await client.recognizeLinkedEntities(
        linkedEntityInput
      );
      const keyPhraseResult = await client.extractKeyPhrases(linkedEntityInput);
      entityResults.forEach((document) => {
        document.entities.forEach((entity) => {
          entity.matches.forEach((match) => {
            return txt.substr(match.offset, match.length + match.offset);
          });
        });
      });
      res.render("analyze", {
        returnUrls: entityResults[0].entities,
        returnText: boldenKeyphrases(
          encodeHTML(txt),
          keyPhraseResult[0].keyPhrases
        ),
      });
    }

    linkedEntityRecognition(textAnalyticsClient);
  }
  GetAnalyzed(
    req.query.txt ||
      "We went to Contoso Steakhouse located at midtown NYC last week for a dinner party, and we adore the spot! They provide marvelous food and they have a great menu. The chief cook happens to be the owner (I think his name is John Doe) and he is super nice, coming out of the kitchen and greeted us all. We enjoyed very much dining in the place! The Sirloin steak I ordered was tender and juicy, and the place was impeccably clean. You can even pre-order from their online menu at www.contososteakhouse.com, call 312-555-0176 or send email to order@contososteakhouse.com! The only complaint I have is the food didn't come fast enough. Overall I highly recommend it!"
  );
});
app.listen(port, function () {
  console.log(`Editor listening on port ${port}!`);
});