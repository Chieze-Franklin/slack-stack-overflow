const Express = require('express')
const bodyParser = require('body-parser')
const soClient = require('./so-client')
const request = require('request-promise-native')

const app = new Express()
app.use(bodyParser.urlencoded({extended: true}))

app.post('/', (req, res) => {

  if (req.body.command === '/so') {//confirm token
    res.status(200).send('Handling your request...');

    soClient(req.body.text)
    .then((response) => {
      let attachments = [];

      if (response.constructor === Error) {
        attachments = [{
          color: 'danger',
          text: 'An error occured while trying to retreive a response from Stack Overflow'
        }];
      }
      else if (response.items) {
        const items = response.items;

        if (items.length === 0) {
          var text = req.body.text.replace(' ', '+'); //replace spaces with pluses to form part of the google url
          var googleLink = 'https://www.google.com/search?q=' + text;
          
          attachments = [{
            color: 'danger',
            title: 'No result found!',
            text: 'Consider rephrasing your request. For instance, make the request shorter by using only key words.'
          }, {
            color: 'warning',
            title: 'Consider asking google',
            title_link: googleLink,
            text: googleLink
          }];
        }
        else if (items.length > 100) {//slack does not allow more than 100 attachments
          items = items.splice(100);
        }

        attachments = items.map((item) => {
          return {
            color: 'good',
            title: item.title,
            title_link: item.link,
            text: item.link
          };
        });
      }
      
      request({
        url: req.body.response_url,
        method: 'POST',
        headers:  {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({text: "Re: " + req.body.text, attachments: attachments}),
        resolveWithFullResponse: true
      })
      .catch((err)=>{ //TODO: replace console.log with better way of reporting error on Heroku
        console.log("error from slack>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        console.log(err)
      })
    })
  }
})

let server = app.listen(process.env.PORT || 5000, () => {
  let port = server.address().port;
  console.log(`Server started on port ${port}`)
})