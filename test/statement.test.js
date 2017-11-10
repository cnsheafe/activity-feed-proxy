const fs = require("fs");
const chai = require("chai");
const randomStatementGenerator = require("../services/statement");

const should = chai.should();
// const expect = chai.expect();
const actors = ["Morty", "Beth", "Summer", "Jerry"];
const verbs = JSON.parse(fs.readFileSync("./assets/verbs.json", "utf-8"));
const activities = JSON.parse(fs.readFileSync("./assets/activities.json", "utf-8"));


describe("StatementGenerator", function () {
  let randStatement = new randomStatementGenerator(
    actors,
    verbs,
    activities
  );

  beforeEach(function () {
    randStatement = new randomStatementGenerator(
      actors,
      verbs,
      activities
    );

    randStatement.randomize();
  });

  it("should populate the statement with non-empty values", function () {
    const sampleStatement = randStatement.createStatement();
    sampleStatement.should.to.be.not.null;
    sampleStatement.should.have.keys("actor", "verb", "object", "result", "context");

    sampleStatement.actor.should.have.keys("mbox", "name");
    sampleStatement.actor.mbox.should.have.length.above(0);
    sampleStatement.actor.name.should.have.length.above(0);

    sampleStatement.verb.should.have.keys("id", "display");
    sampleStatement.verb.id.should.have.length.above(0);

    sampleStatement.object.should.to.exist;
    if (sampleStatement.object.objectType === "Agent") {
      // sampleStatement.object.should.have.keys("name", "mbox");
      // sampleStatement.object.mbox.should.have.length.above(0);
      // sampleStatement.object.name.should.have.length.above(0);
    } else {
      sampleStatement.object.should.have.keys("id", "definition");
      sampleStatement.object.id.should.have.length.above(0);
      sampleStatement.object.definition.should.not.be.null;
    }

    sampleStatement.context.should.have.keys("registration", "instructor", "contextActivities");
    sampleStatement.context.registration.should.have.length.above(0);
    sampleStatement.context.instructor.should.have.keys("objectType", "name", "mbox");
    sampleStatement.context.instructor.objectType.should.equal("Agent");
    sampleStatement.context.instructor.name.should.have.length.above(0);
    sampleStatement.context.instructor.mbox.should.have.length.above(0);
    sampleStatement.context.contextActivities.should.have.keys("parent");
    sampleStatement.context.contextActivities.parent.should.have.keys("id", "definition");
    
    // sampleStatement.context.contextActivities.parent[0].id.should.have.length.above(0);
    // sampleStatement.context.contextActivities.parent[0].definition.should.have.property("en-US");

  });
});