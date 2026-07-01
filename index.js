const fs = require("node:fs");
const path = require("node:path");
const { execSync } = require("node:child_process");
const inquirer = require("inquirer");

const folders = [
    "config",
    "controllers",
    "middlewares",
    "repositories",
    "routes",
    "services",
    "validators",
    "constants",
    "utils",
];

const files = ["server.js", "app.js", ".env"];

const projectName = process.argv[2];

if (!projectName) {
    throw new Error("You must provide a project name");
}

const projectPath = path.join("../", projectName);

try {
    fs.mkdirSync(projectPath, { recursive: true });
} catch (err) {
    throw new Error(`Failed to create project folder: ${err.message}`);
}

for (const folder of folders) {
    try {
        const folderPath = path.join(projectPath, "src", folder);

        fs.mkdirSync(folderPath, {
            recursive: true,
        });
    } catch (err) {
        throw new Error(`Failed to create folders: ${err.message}`);
    }
}

for (const file of files) {
    try {
        if (file === ".env") {
            fs.writeFileSync(path.join(projectPath, ".env"), "");
            continue;
        }

        fs.writeFileSync(path.join(projectPath, "src", file), "");
    } catch (err) {
        throw new Error(`Failed to create files: ${err.message}`);
    }
}

async function installPackages() {
    try {
        execSync("npm init -y", {
            cwd: projectPath,
            stdio: "inherit",
        });
    } catch (err) {
        console.error("Failed to initialize project");
        console.error(err.message);
        process.exit(1);
    }

    const answers = await inquirer.prompt([
        {
            type: "confirm",
            name: "express",
            message: "Do you want Express?",
        },
        {
            type: "confirm",
            name: "dotenv",
            message: "Do you want dotenv?",
        },
        {
            type: "confirm",
            name: "nodemon",
            message: "Do you want nodemon?",
        },
        {
            type: "confirm",
            name: "auth",
            message: "Do you want authentication system with JWT and cookies?",
        },
        {
            type: "confirm",
            name: "bcrypt",
            message: "Do you want password hashing with bcrypt?",
        },
        {
            type: "confirm",
            name: "validation",
            message: "Do you want request validation with Zod?",
        },
        {
            type: "list",
            name: "database",
            message: "Choose database:",
            choices: ["MongoDB", "PostgreSQL", "None"],
        },
        {
            type: "list",
            name: "postgresOrm",
            message: "Choose PostgreSQL ORM:",
            choices: ["Prisma", "Sequelize"],
            when: (answers) => answers.database === "PostgreSQL",
        },
        {
            type: "confirm",
            name: "window",
            message: "Do you want open project in new VS Code window",
        },
    ]);

    const dependencies = [];
    const devDependencies = [];

    if (answers.express) {
        dependencies.push("express");
    }

    if (answers.dotenv) {
        dependencies.push("dotenv");
    }

    if (answers.auth) {
        dependencies.push("jsonwebtoken", "cookie-parser");
    }

    if (answers.bcrypt) {
        dependencies.push("bcrypt");
    }

    if (answers.validation) {
        dependencies.push("zod");
    }

    if (answers.nodemon) {
        devDependencies.push("nodemon");
    }

    if (answers.database === "MongoDB") {
        dependencies.push("mongoose");
    }

    if (answers.database === "PostgreSQL") {
        dependencies.push("pg");

        if (answers.postgresOrm === "Prisma") {
            dependencies.push("@prisma/client");
            devDependencies.push("prisma");
        }

        if (answers.postgresOrm === "Sequelize") {
            dependencies.push("sequelize", "pg-hstore");
            devDependencies.push("sequelize-cli");
        }
    }

    try {
        if (dependencies.length > 0) {
            console.log("\nInstalling dependencies...\n");

            execSync(`npm install ${dependencies.join(" ")}`, {
                cwd: projectPath,
                stdio: "inherit",
            });
        }

        if (devDependencies.length > 0) {
            console.log("\nInstalling dev dependencies...\n");

            execSync(`npm install -D ${devDependencies.join(" ")}`, {
                cwd: projectPath,
                stdio: "inherit",
            });
        }

        if (
            answers.database === "PostgreSQL" &&
            answers.postgresOrm === "Prisma"
        ) {
            console.log("\nInitializing Prisma...\n");

            execSync("npx prisma init", {
                cwd: projectPath,
                stdio: "inherit",
            });
        } else if (
            answers.database === "PostgreSQL" &&
            answers.postgresOrm === "Sequelize"
        ) {
            console.log("\nInitializing Sequelize...\n");

            execSync("npx sequelize-cli init", {
                cwd: projectPath,
                stdio: "inherit",
            });
        }

        console.log("\nProject structure created successfully!");

        if (answers.window) {
            execSync(`code ${projectPath}`);
        } else {
            console.log(`Run this:`);
            console.log(`cd ${projectPath}`);
        }
    } catch (err) {
        console.error("Failed to install packages");
        console.error("Message:", err.message);
        console.error("Exit code:", err.status);

        process.exit(1);
    }
}

installPackages();