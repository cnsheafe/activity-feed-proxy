class RandomStatementGenerator {
  constructor(actorChoices, verbChoices, activityChoices) {
    this._email = "";
    this._username = "";
    this._verb = "";
    this._verbUri = "";
    this._activity = "";
    this._activityUri = "";

    this._possibleUsers = actorChoices;
    this._possibleVerbs = verbChoices;
    this._possibleActivities = activityChoices;
  }

  randomize() {
    this._username = this._possibleUsers[Math.floor(Math.random() * 4)];
    this._email = `${this._username}@playposit.com`;

    const verbIndex = Math.floor(Math.random() * this._possibleVerbs.length);
    const verbSource = this._possibleVerbs[verbIndex]
    this._verb = verbSource.name;
    this._verbUri = verbSource.uri;

    const activityIndex = Math.floor(Math.random() * this._possibleActivities.length);
    const activitySource = this._possibleActivities[activityIndex];

    this._activity = activitySource.name;
    this._activityUri = activitySource.uri;
  }

  createStatement() {
    return {
      "actor": {
        mbox: `mailto:${this._email}`,
        name: `${this._username}`,
      },
      "verb": {
        id: `${this._verbUri}`,
        display: this._verb
      },
      object: {
        id: `${this._activityUri}`,
        definition: {
          name: this._activity
        }
      }
    };
  }
}

module.exports = RandomStatementGenerator;