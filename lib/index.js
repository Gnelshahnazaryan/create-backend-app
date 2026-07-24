const path = require("node:path");
const fs = require("node:fs");

const { askQuestions } = require("./prompts");
const { createStructure } = require("./folders");
const { installPackages } = require("./installer");

const projectName = process.argv[2];

if (!projectName) {
    throw new Error("You must provide a project name");
}

const projectPath = path.join(process.cwd(), projectName);

try {
    fs.mkdirSync(projectPath, { recursive: true });
} catch (err) {
    throw new Error(
        `Failed to create project folder: ${err.message}`
    );
}

createStructure(projectPath);

async function run() {
    const answers = await askQuestions();
    installPackages(projectPath, answers);
}

run();