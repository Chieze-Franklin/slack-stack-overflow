const Express = require('express')
const bodyParser = require('body-parser')
const soClient = require('./so-client')
const request = require('request-promise-native')

const app = new Express()
app.use(bodyParser.urlencoded({extended: true}))

/*const {SLACK_TOKEN: slackToken, REBRANDLY_APIKEY: apiKey, PORT} = process.env

if (!slackToken || !apiKey) {
  console.error('missing environment variables SLACK_TOKEN and/or REBRANDLY_APIKEY')
  process.exit(1)
}*/

//const port = 80

//const rebrandlyClient = createShortUrlsFactory(apiKey)
//const slashCommand = slashCommandFactory(rebrandlyClient, slackToken)

app.post('/', (req, res) => {

  if (req.body.command === '/so') {
    res.status(200).send("Handling your request...");

    soClient(req.body.text)
    .then((response) => {
      const items = response.items;
      let attachments =
      items.map((item) => {
        return {
          color: 'good',
          text: `[${item.title}](${item.link})`,
          mrkdwn_in: ['text']
        };
      });
      request({
        url: req.body.response_url,
        method: "POST",
        headers:  {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({text: "Re: " + req.body.text, attachments: attachments}),
        resolveWithFullResponse: true
      })
      .catch((err)=>{
        console.log("from slack:")
        console.log(err)
      })
    })
  }
})

let server = app.listen(process.env.PORT || 5000, () => {
  let port = server.address().port;
  console.log(`Server started at localhost:${port}`)
})