const fs = require("fs");

function parseAssets(filepath) {
  const source = JSON.parse(fs.readFileSync(filepath, "utf-8"));
  return source.map(item => {
    return {
      name: item.metadata.metadata.name,
      uri: item.uri
    };
  });
}

fs.writeFileSync(
  "./assets/verbs.json",
  JSON.stringify(parseAssets("./assets/verbs-raw.json")),
  "utf-8"
);

fs.writeFileSync(
  "./assets/activities.json",
  JSON.stringify(parseAssets("./assets/activities-raw.json")),
  "utf-8"
);

return 0;