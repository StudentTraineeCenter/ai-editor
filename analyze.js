const {
    TextAnalyticsClient,
    TextAnalyticsApiKeyCredential
  } = require("@azure/ai-text-analytics");
const credentials = require("./creds.js");

function GetAnalyzed(txt) {
  "use strict";
  const textAnalyticsClient = new TextAnalyticsClient(credentials.creds.endpoint,  new TextAnalyticsApiKeyCredential(credentials.creds.key));
  async function linkedEntityRecognition(client){

    const linkedEntityInput = [
        "Microsoft was founded by Bill Gates and Paul Allen on April 4, 1975, to develop and sell BASIC interpreters for the Altair 8800. During his career at Microsoft, Gates held the positions of chairman, chief executive officer, president and chief software architect, while also being the largest individual shareholder until May 2014."
    ];
    const entityResults = await client.recognizeLinkedEntities(linkedEntityInput);

    entityResults.forEach(document => {
        document.entities.forEach(entity => {
            console.log(`\tName: ${entity.name} \tID: ${entity.id} \tURL: ${entity.url} \tData Source: ${entity.dataSource}`);
            
        });
    });
}
linkedEntityRecognition(textAnalyticsClient);
}
exports.do = GetAnalyzed ;
