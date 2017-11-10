const Express = require('express')
const bodyParser = require('body-parser')
const soClient = require('./so-client')
const request = require('request-promise-native')

const app = new Express()
app.use(bodyParser.urlencoded({extended: true}))

app.post('/', (req, res) => {

  if (req.body.command === '/so') {
    res.status(200).send("Handling your request...");

    soClient(req.body.text)
    .then((response) => {
      const items = response.items; 
      if (items.length > 100) {//slack does not allow more than 100 attachments
        items = items.splice(100);
      }
      let attachments = items.map((item) => {
        return {
          color: 'good',
          title: item.title,
          title_link: item.link,
          text: item.link
        };
      });
      if (items.length === 0) {
        attachments = [{
          color: 'danger',
          title: 'No result found!',
          text: 'Consider rephrasing your request. For instance, make the request shorter by using only key words.'
        }];
      }

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
        console.log("error from slack:")
        console.log(err)
      })
    })
  }
})

let server = app.listen(process.env.PORT || 5000, () => {
  let port = server.address().port;
  console.log(`Server started on port ${port}`)
})