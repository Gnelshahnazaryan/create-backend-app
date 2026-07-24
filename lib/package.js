const fs = require("node:fs");
const path = require("node:path");

function updatePackageJson(projectPath, isHaveNodemon) {
    const packageJsonPath = path.join(projectPath, "package.json");

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    packageJson.main = "src/server.js";

    packageJson.scripts.dev = isHaveNodemon ? "nodemon src/server.js" : "node src/server.js";
    packageJson.scripts.start = "node src/server.js";

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
}

module.exports = updatePackageJson;
