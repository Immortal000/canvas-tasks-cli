import chalk from 'npm:chalk';
import { Inquire } from "jsr:@mxkit/inquire";
import random from 'jsr:@yuhenabc/random';

// creates the file where the todos will be stored

// get the cli arg
const args = Deno.args;
const command = args[0];

// conditional for the command
if (command == 'create'){
  await Deno.create(`${Deno.env.get("HOME")}/todos.json`);
  await Deno.writeTextFile(`${Deno.env.get("HOME")}/todos.json`, JSON.stringify({user: Deno.env.get("USER"), todos: [], canvas_todos: []}));
}
else if (command == 'new'){
  const new_task_input = await new Inquire()
  .input({name: 'task', type: 'string', message: 'Enter the task: '}, )
  .input({name: 'deadline', type: 'string', message: 'Enter the deadline (mm/dd/yy HH:MM): '})
  .input({name: 'url', type: 'string', message: 'Enter any url or leave it empty: '})
  .select({
    name: 'priority', message: 'Choose priority of task', choices: [chalk.green('low'), chalk.magenta('medium'), chalk.red('high')]
  })
  .run();

  const tasks_file = await import(`${Deno.env.get("HOME")}/todos.json`, {
    with: { type: "json" },
  });

  const new_task = {id: random(4), title: new_task_input.task, deadline: new Date(new_task_input.deadline), url: new_task_input.url, priority: new_task_input.priority};

  // tasks_file.default.todos.push(new_task);
  // await Deno.writeTextFile(`${Deno.env.get("HOME")}/todos.json`, JSON.stringify(tasks_file.default));
}
// Viewing the tasks
else if (command == 'view'){
  const tasks_file = await import(`${Deno.env.get("HOME")}/todos.json`, {
    with: { type: "json" },
  });

  const todos = tasks_file.default.todos;
  const canvas_todos = tasks_file.default.canvas_todos;

  console.log(chalk.underline(chalk.bold(`Tasks for ${tasks_file.default.user}`)));
}