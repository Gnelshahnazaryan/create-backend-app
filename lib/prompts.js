const inquirer = require("inquirer");

function askQuestions() {
    return inquirer.prompt([
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
            type: "confirm",
            name: "cors",
            message: "Do you want cors?",
        },
        {
            type: "confirm",
            name: "helmet",
            message: "Do you want helmet for security?",
        },
        {
            type: "confirm",
            name: "logger",
            message: "Do you want logging system?",
        },
        {
            type: "list",
            name: "loggers",
            message: "Choose logger",
            choices: ["Pino", "Winston", "Morgan", "Winston and Morgan", "Pino and Morgan", "None"],
            when: (answers) => answers.logger === true,
        },
        {
            type: "confirm",
            name: "swagger",
            message: "Do you want swagger?",
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
            type:"confirm",
            name:"redis",
            message:"Do you want to use Redis?"
        },
        {
            type: "confirm",
            name: "window",
            message: "Do you want open project in new VS Code window",
        },
    ]);
}

module.exports = { askQuestions };
