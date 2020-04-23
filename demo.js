const {
  TextAnalyticsClient,
  TextAnalyticsApiKeyCredential,
} = require("@azure/ai-text-analytics"); // Importujeme Azure Text Analytics
const text_k_analyze =
  "We went to Contoso Steakhouse located at midtown NYC last week for a dinner party, and we adore the spot! They provide marvelous food and they have a great menu. The chief cook happens to be the owner (I think his name is John Doe) and he is super nice, coming out of the kitchen and greeted us all. We enjoyed very much dining in the place! The Sirloin steak I ordered was tender and juicy, and the place was impeccably clean. You can even pre-order from their online menu at www.contososteakhouse.com, call 312-555-0176 or send email to order@contososteakhouse.com! The only complaint I have is the food didn't come fast enough. Overall I highly recommend it! "; //Vytvoříme konstantu, která je nastavená na parametr txt v URL adrese.

const endpoint = "VAS_KONCOVY_BOD";
const key = "VAS_KLIC";

const textAnalyticsClient = new TextAnalyticsClient(
  endpoint,
  new TextAnalyticsApiKeyCredential(key)
);
async function linkedEntityRecognition(client) {
  const linkedEntityInput = [text_k_analyze];
  const entityResults = await client.recognizeLinkedEntities(linkedEntityInput); // Počkáme než Azure pošle odpověď
  entityResults.forEach((document) => {
    document.entities.forEach((entity) => {
      entity.matches.forEach((match) => {
        console.log(
          `\tNázev: ${entity.name} \tID:  ${entity.dataSourceEntityId} \tURL: ${entity.url} \tZdroj dat: ${entity.dataSource}`
        ); // A teď do konzole vypíšeme co všechno jsme v textu našli a přidáme URL adresy
        console.log(`\tNašel jsem::`);
        entity.matches.forEach((match) => {
          console.log(
            `\t\tText: ${match.text} \tPřesnost: ${match.score.toFixed(2)}`
          );
        });
      });
    });
  });
}
linkedEntityRecognition(textAnalyticsClient);
