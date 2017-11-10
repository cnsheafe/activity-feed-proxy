const fs = require("fs");

const express = require("express");
const bodyParser = require("body-parser");
const adl = require("adl-xapiwrapper");

const randomStatementGenerator = require("./services/statement");

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

const verbs = JSON.parse(fs.readFileSync("./assets/verbs.json", "utf-8"));
const activities = JSON.parse(fs.readFileSync("./assets/activities.json", "utf-8"));

const randStatement = new randomStatementGenerator(
  ["Morty", "Beth", "Summer", "Jerry"],
  verbs,
  activities
);

app.get("/", function (req, res) {
  randStatement.randomize();
  return new Promise(function (resolve, reject) {
    lrs.sendStatements(randStatement.createStatement(),
      function (err, resp, body) {
        if (err) {
          reject(err);
        }
        else {
          adl.log("info", resp.statusCode);
          adl.log("info", body);
          res.status = 200;
          res.send("Finished!");
          resolve();
        }
      });
  });
});

app.get("/feed", function (req, res) {
  lrs.getStatements(null, null, function (err, resp, body) {
    adl.log("info", resp.statusCode);
    adl.log("info", body);
    if (JSON.parse(body).more) {
      lrs.getStatements(null, null, function (err, resp, body) {
        console.log("More to come!");
        res.status = resp.statusCode;
        res.send(body);
      });
    } else {
      console.log("That's it!");
      res.status(resp.statusCode);
      res.send(body);
    }
  });
});

let server;
const PORT = +process.argv[2] || 3000;
function openServer() {
  return new Promise(function (resolve, reject) {
    server = app.listen(PORT, function () {
      console.log("Creating server!");
      resolve(server);
    }).on("error", err => {
      reject(err);
    });
  });
}

function closeServer() {
  return new Promise(function (resolve, reject) {
    console.log("Closing server!");
    server.close(err => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

if (require.main === module) {
  openServer().catch(err => console.error(err));
}

module.exports = {
  openServer,
  closeServer,
  app
};