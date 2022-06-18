const { response } = require("express");
const inquire = require("inquirer");
const connection = require("./connection");
require("console.table");

// THEN I am presented with the following options: view all departments, view all roles, view all employees, add a department, add a role, add an employee, and update an employee role
askUser();
function askUser() {
  inquire
    .prompt([
      {
        name: "chooseRole",
        type: "list",
        message: "What would you like to do?",
        choices: [
          "view all departments",
          "view all roles",
          "view all employees",
          "add a department",
          "add a role",
          "add an employee",
          "update an employee role",
          "finish",
        ],
      },
    ])
    .then((answer) => {
      console.log("this is me Wilson --- ", answer);
      switch (answer.chooseRole) {
        case "view all departments":
          viewAllDepartment();
          break;
        case "view all roles":
          viewAllRole();
          break;
        case "view all employees":
          viewAllEmployee();
          break;
        case "add a department":
          addDepartment();
          break;
        case "add a role":
          addRole();
          break;
        case "add an employee":
          alert("You typed in a 4");
          break;
        case "update an employee role":
          alert("You typed in a 4");
          break;
        case "finish":
          console.log("Good Bye");
          process.exit();
        default:
          console.log("I Don't know what to do");
      }
    });
}
function viewAllDepartment() {
  connection
    .promise()
    .query(`SELECT * FROM department`)
    .then(([res]) => {
      console.log("\n");
      console.table(res);
    })
    .then(() => {
      askUser();
    });
}
function viewAllRole() {
  connection
    .promise()
    .query(`SELECT * FROM role`)
    .then(([res]) => {
      console.log("\n");
      console.table(res);
    })
    .then(() => {
      askUser();
    });
}
function viewAllEmployee() {
  connection
    .promise()
    .query(`SELECT * FROM employee`)
    .then(([res]) => {
      console.log("\n");
      console.table(res);
    })
    .then(() => {
      askUser();
    });
}
function addDepartment() {
inquire.prompt({
  name: "addDepartment",
  type: "input",
  message: "What department would you like to add?",
}).then(({ addDepartment })=>{
  connection
    .promise()
    .query(`INSERT INTO department (name) VALUES ("${addDepartment}")`)
    .then(([res]) => {
      console.log("\n");
      console.log("Department added!");
    })
    .then(() => {
      askUser();
    });
  });  
}
async function addRole() {
let departments;
// await connection
//   .promise()
//   .query(`SELECT * FROM department`).then(([res])=>{
//     console.log(res)
//     departments = res
//   })
inquire.prompt([{
  name: "addRole",
  type: "input",
  message: "What Role would you like to add?",
},
{
  name: "addSalary",
  type: "input",
  message: "What is the salary of the role?",
},
{
  name: "addDid",
  type: "list",
  message: "What department is this role for?",
  choices: async () => {
    const [res] = await connection
    .promise()
    .query(`SELECT * FROM department`);
    return res.map(a => ({name: a.name, value:a.id}))
  }
}]).then(({ addRole })=>{
  connection
    .promise()
    .query(`INSERT INTO role (title, salary, department_id) VALUES ("${addRole}",salary,)`)
    .then(([res]) => {
      console.log("\n");
      console.log("Department added!");
    })
    .then(() => {
      askUser();
    });
  });  
}

// GIVEN a command-line application that accepts user input
// WHEN I start the application
// WHEN I choose to view all departments
// THEN I am presented with a formatted table showing department names and department ids
// WHEN I choose to view all roles
// THEN I am presented with the job title, role id, the department that role belongs to, and the salary for that role
// WHEN I choose to view all employees
// THEN I am presented with a formatted table showing employee data, including employee ids, first names, last names, job titles, departments, salaries, and managers that the employees report to
// WHEN I choose to add a department
// THEN I am prompted to enter the name of the department and that department is added to the database
// WHEN I choose to add a role
// THEN I am prompted to enter the name, salary, and department for the role and that role is added to the database
// WHEN I choose to add an employee
// THEN I am prompted to enter the employee’s first name, last name, role, and manager, and that employee is added to the database
// WHEN I choose to update an employee role
// THEN I am prompted to select an employee to update and their new role and this information is updated in the database
