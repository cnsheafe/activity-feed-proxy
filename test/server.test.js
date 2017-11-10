const chai = require("chai");
const chaiHttp = require("chai-http");
const {
  openServer,
  closeServer,
  app
} = require("../server");

const should = chai.should();
chai.use(chaiHttp);

describe("Generate random statement", function () {
  before(function () {
    return openServer();
  });  

  after(function () {
    return closeServer();
  });

  it("should successfully send a statement on GET /", function () {
    return chai.request(app)
      .get("/")
      .then(function (res) {
        res.should.have.status(200);
        res.text.should.equal("Finished!");
      })
      .catch(function (err) {
        throw err;
      });
  });
});

describe("Retrive statements from LRS", function () {
  before(function () {
    return openServer();
  });  

  after(function () {
    return closeServer();
  });

  it("should successfully get a list of statements with GET /feed", function () {
    return chai.request(app)
      .get("/feed")
      .then(function (res) {
        res.should.have.status(200);
        const body = JSON.parse(res.text);
        body.should.have.property("statements");
        body.statements.should.have.length.above(0);
      })
      .catch(function (err) {
        throw err;
      });
  });
});
