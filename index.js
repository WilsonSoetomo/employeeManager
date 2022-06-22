const { response } = require("express");
const inquirer = require("inquirer");
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
          "delete an employee",
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
          addEmployee();
          break;
        case "delete an employee":
          deleteEmployee();
          break;
        case "update an employee role":
          updateEmployee();
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
  inquire
    .prompt({
      name: "addDepartment",
      type: "input",
      message: "What department would you like to add?",
    })
    .then(({ addDepartment }) => {
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

  inquire
    .prompt([
      {
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
        choices: () => {
          return connection
            .promise()
            .query(`SELECT * FROM department`)
            .then(([res]) => {
              console.log("before mapping", res);
              const mapped = res.map((a) => ({ name: a.name, value: a.id }));
              console.log("after mapping", mapped);
              return mapped;
            });
          // return res.map(a => ({name: a.name, value:a.id}))
        },
      },
    ])
    .then(({ addRole, addSalary, addDid }) => {
      connection
        .promise()
        .query(
          `INSERT INTO role (title, salary, department_id) VALUES ("${addRole}",${addSalary},${addDid})`
        )
        .then(([res]) => {
          console.log("\n");
          console.log("Department added!");
        })
        .then(() => {
          askUser();
        });
    });
}

async function deleteEmployee() {
  //get all employees first to list as choices when deleting
  const [res] = await connection.promise().query("SELECT * FROM employee");
  const {id} = await inquirer.prompt({
    message: "which user to delete?",
    type: "list",
    name: "id",
    choices: res.map((a) => ({
      name: `${a.first_name} ${a.last_name}`,
      value: a.id,
    })),
  });
  console.log("you chose --- ", id);

  await connection.promise().query(`DELETE FROM employee WHERE id=${id}`);
  console.log("you deleted a employee");
  askUser()
}
async function addEmployee() {
  const [res] = await connection.promise().query("SELECT * FROM employee");
  const [roles_res] = await connection.promise().query("SELECT * FROM role");
  const managers = res.map((a) => ({
    name: `${a.first_name} ${a.last_name}`,
    value: a.id,
  }))
  const roles = roles_res.map((a) => ({
    name: `${a.title}`,
    value: a.id,
  }))
  //get all employees first to list as choices when deleting
  // const [res] = await connection.promise().query("SELECT * FROM employee");
  // const {id} = await inquirer.prompt({
  //   message: "which employee to add?",
  //   type: "input",
  //   name: "id",
  //   choices: res.map((a) => ({
  //     name: `${a.first_name} ${a.last_name}`,
  //     value: a.id,
  //   })),
  // }
  const answers = await inquirer.prompt([
    {
      message: "What is the new employee's first name?",
      name: "first_name",
      type:"input"
    },
    {
      message: "What is the new employee's last name?",
      name: "last_name",
      type:"input"
    },
    {
      message: "What is the new employee's role id?",
      name: "role_id",
      type:"list",
      choices: roles
    },
    {
      message: "What is the new employee's manager?",
      name: "manager_id",
      type:"list",
      choices: managers
    },
  ])
  console.log("you chose --- ", answers.managerId);

  await connection.promise().query(`INSERT INTO employee SET ?`, answers);
  console.log("you added an employee");
  askUser()
}
async function updateEmployee() {
  //get all employees first to list as choices when deleting
  const [res] = await connection.promise().query("SELECT * FROM employee");
  const [role] = await connection.promise().query("SELECT * FROM role");
  const {id} = await inquirer.prompt({
    message: "which employee's role would you like to change?",
    type: "list",
    name: "id",
    choices: res.map((a) => ({
      name: `${a.first_name} ${a.last_name}`,
      value: a.id,
    })),
  });
  const {roleid} = await inquirer.prompt({
    message: "what role do you want to give the employee?",
    type: "list",
    name: "roleid",
    choices: role.map((a) => ({
      name: `${a.title}`,
      value: a.id,
    })),
  });
  console.log("you chose --- ", id);

  await connection.promise().query(`UPDATE employee SET role_id = ${roleid} WHERE id=${id}`);
  console.log("you added an employee");
  askUser()
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
