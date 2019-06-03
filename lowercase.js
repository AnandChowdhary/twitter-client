const fs = require("fs");
const path = require("path");

const file = (fs.readFileSync(path.join(__dirname, "data.json"))).toString().toLowerCase();
fs.writeFileSync(path.join(__dirname, "data-lowercase.json"), file);
console.log("Done!");
