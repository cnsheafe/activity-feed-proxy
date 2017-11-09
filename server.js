const express = require("express");
const adl = require("adl-xapiwrapper");
const bodyParser = require("body-parser");


// Initializes the API wrapper
// parameters used from LRS host
const lrs = new adl.XAPIWrapper({
  "url": process.env.LRS_URL,
  "auth": {
    "user": process.env.LRS_KEY,
    "pass": process.env.LRS_SECRET
  }
});

const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));

app.post("/", function (req, res) {
  const statement = {
    "actor": {
      mbox: `mailto:${req.body.email}`,
      name: `${req.body.username}`,
    },
    "verb": {
      id: `${req.body.verbUri}`,
      display: {
        "en-US": `${req.body.verb}`
      },
    },
    object: {
      id: `${req.body.activityUri}`,
      definition: {
        name: {
          "en-US": `${req.body.activity}`
        }
      }
    }
  };
  let msg;
  lrs.sendStatements(statement, function (err, resp, body) {
    adl.log("info", resp.statusCode);
    adl.log("info", body);
    console.log(body);
    res.status = resp.statusCode;
    msg = JSON.stringify(body);
  });
  res.send(msg);
});

app.listen(3000, function () {
  console.log("Server started up!");
});