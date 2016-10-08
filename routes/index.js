var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
}); 

router.get('/webhook', function(req, res) {
  if (req.query['hub.verify_token'] === 'B7g2z8bLbVDd59z9F6x5hQrFq1Mk1NReH1ZCUHW0X4zXRS1LYoQtZAJURWQO5eMPtiApvs6Ml5iJp91zwqnubUgZDZD') {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});

router.post('/webhook/', function (req, res) {
  const events = req.body.entry[0].messaging;
    console.log("events.length:" + events.length)
    for (i = 0; i < events.length; i++) {
      const event = req.body.entry[0].messaging[i];
      console.log("event:" + event.message)
      if (event.message && event.message.text) {
        const text = event.message.text;
        console.log(text)
        sendTextMessage(sender, "Text received, echo: " + text);
      }
    }
  res.sendStatus(200);
});

var request = require('request')

const ACCESS_TOKEN = process.env.FB_ACCESS_TOKEN

function sendTextMessage(sender, text) {
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token: ACCESS_TOKEN},
    method: 'POST',
    json: {
      recipient: {id: sender},
      message: {text: text}
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}

module.exports = router;
