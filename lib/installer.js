const { execSync } = require("node:child_process");
const updatePackageJson = require("./package.js");

function installPackages(projectPath, answers) {
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

    if (answers.cors) {
        dependencies.push("cors");
    }

    if (answers.helmet) {
        dependencies.push("helmet");
    }

    if (answers.logger) {
        if (answers.loggers === "Winston and Morgan") {
            dependencies.push("winston", "morgan");
        } else if (answers.loggers === "Pino and Morgan") {
            dependencies.push("pino", "morgan");
        } else if (answers.loggers === "Pino") {
            dependencies.push("pino");
        } else if (answers.loggers === "Winston") {
            dependencies.push("winston");
        } else {
            dependencies.push("morgan");
        }
    }

    if (answers.swagger) {
        dependencies.push("swagger-jsdoc", "swagger-ui-express");
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

    if(answers.redis) {
        dependencies.push("redis");
    }

    try {
        execSync("npm init -y", {
            cwd: projectPath,
            stdio: "inherit",
        });

        updatePackageJson(projectPath,answers.nodemon);

        if (dependencies.length > 0) {
            execSync(`npm install ${dependencies.join(" ")}`, {
                cwd: projectPath,
                stdio: "inherit",
            });
        }

        if (devDependencies.length > 0) {
            execSync(`npm install -D ${devDependencies.join(" ")}`, {
                cwd: projectPath,
                stdio: "inherit",
            });
        }

        if (answers.database === "PostgreSQL" && answers.postgresOrm === "Prisma") {
            execSync("npx prisma init", {
                cwd: projectPath,
                stdio: "inherit",
            });
        } else if (answers.database === "PostgreSQL" && answers.postgresOrm === "Sequelize") {
            execSync("npx sequelize-cli init", {
                cwd: projectPath,
                stdio: "inherit",
            });
        }

        if (answers.window) {
            execSync(`code ${projectPath}`);
        } else {
            console.log(`Run this:`);
            console.log(`cd ${projectPath}`);
        }

        console.log("\nProject structure created successfully!");
    } catch (err) {
        console.error("Failed to install packages");
        console.error(err.message);
        process.exit(1);
    }
}

module.exports = { installPackages };
