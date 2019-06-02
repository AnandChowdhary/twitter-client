const fs = require("fs");
const path = require("path");

const keys = [];
const data = JSON.parse((fs.readFileSync(path.join(__dirname, "data.json"))).toString());
data.forEach(record => {
  for (key in record) {
    if (!key.startsWith("hashtag"))
      if (!keys.includes(key))
        keys.push(key);
  }
});
fs.writeFileSync(path.join(__dirname, "text"), JSON.stringify(keys));
console.log("Keys are", JSON.stringify(keys));
