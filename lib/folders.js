const fs = require("node:fs");
const path = require("node:path");

const folders = [
    "config",
    "constants",
    "controllers",
    "middlewares",
    "repositories",
    "routes",
    "services",
    "validators",
    "utils",
];

const files = ["server.js", "app.js", ".env", ".gitignore"];

function createStructure(projectPath) {
    for (const folder of folders) {
        const folderPath = path.join(projectPath, "src", folder);

        fs.mkdirSync(folderPath, {
            recursive: true,
        });
    }

    for (const file of files) {
        if (file === ".env") {
            fs.writeFileSync(path.join(projectPath, ".env"), "");
            continue;
        }

        if (file === ".gitignore") {
            fs.writeFileSync(
                path.join(projectPath, ".gitignore"),
                "node_modules\n.env\n"
            );
            continue;
        }

        fs.writeFileSync(
            path.join(projectPath, "src", file),
            ""
        );
    }

}

module.exports = { createStructure };