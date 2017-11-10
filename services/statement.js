const uuidV4 = require("uuid/v4");

class RandomStatementGenerator {
  constructor(actorChoices, verbChoices, activityChoices) {
    this._email = "";
    this._username = "";
    this._instructor = "";
    this._instructorEmail = "";
    this._verb = "";
    this._verbUri = "";
    this._parentActivity = "";
    this._parentActivityUri = "";
    this._result = 100;

    this._possibleUsers = actorChoices;
    this._possibleVerbs = verbChoices;
    this._possibleActivities = activityChoices;
  }

  randomize() {
    this._username = this._possibleUsers[Math.floor(Math.random() * 4)];
    this._email = `${this._username}@playposit.com`;

    this._instructor = this._possibleUsers[Math.floor(Math.random() * 4)];
    this._instructorEmail = `${this._instructor}@playposit.com`;
    const verbIndex = Math.floor(Math.random() * this._possibleVerbs.length);
    const verbSource = this._possibleVerbs[verbIndex];
    this._verb = verbSource.name;
    this._verbUri = verbSource.uri;

    if (Math.floor(Math.random() * 2) !== 0) {
      const randAgent = this._possibleUsers[Math.floor(Math.random() * 4)];
      this._obj = {
        objectType: "Agent",
        name: randAgent,
        mbox: `mailto:${randAgent}@playposit.com`
      };
    } else {
      const activityIndex = Math.floor(Math.random() * this._possibleActivities.length);
      const activitySource = this._possibleActivities[activityIndex];

      this._obj = {
        id: activitySource.uri,
        definition: {
          name: activitySource.name
        }
      };
    }


    const parentActivityIndex = Math.floor(Math.random() * this._possibleActivities.length);
    const parentActivitySource = this._possibleActivities[parentActivityIndex];

    this._parentActivity = parentActivitySource.name;
    this._parentActivityUri = parentActivitySource.uri;

    this._result = Math.floor(Math.random() * 100 + 1);
  }

  createStatement() {
    return {
      actor: {
        mbox: `mailto:${this._email}`,
        name: this._username,
      },
      verb: {
        id: this._verbUri,
        display: this._verb
      },
      object: this._obj,
      result: {
        score: {
          scaled: this._result / 100,
          min: 0,
          max: 100,
          raw: this._result
        },
        success: this._result > 50 ? true : false
      },
      context: {
        registration: uuidV4(),
        instructor: {
          objectType: "Agent",
          name: this._instructor,
          mbox: `mailto:${this._instructorEmail}`
        },
        contextActivities: {
          parent: {
            id: this._parentActivityUri,
            definition: {
              name: this._parentActivity
            }
          }
        }
      }
    };
  }
}

module.exports = RandomStatementGenerator;