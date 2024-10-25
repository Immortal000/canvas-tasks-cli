import ical from 'npm:ical';
import random from 'jsr:@yuhenabc/random';

const ics_calendar = await Deno.readTextFile('/Users/sid/Desktop/pdfs/canvas_assignments.ics');

const events = ical.parseICS(ics_calendar);

const tasks_file = await import(`${Deno.env.get("HOME")}/todos.json`, {
    with: { type: "json" },
});

// Flag to either override the current canvas tasks or append them
const override = Deno.args[0] == 'override';

if (override){
    tasks_file.default.canvas_todos = [];
}

const classifyPriority = (date: string): string => {
    const today = new Date();
    const due_date = new Date(date);

    const diff = due_date.getTime() - today.getTime();
    const diff_days = diff / (1000 * 3600 * 24);

    if (diff_days <= 2) return "high";
    else if (diff_days <= 7) return "medium";
    else return "low";
}

const classifyOverdue = (date: string): boolean => {
    const today = new Date();
    const due_date = new Date(date);

    return due_date.getTime() < today.getTime();
}

const sortBasedOnPriority = (tasks: {random: any, title: string, deadline: Date, url: string, priority: 'high' | 'medium' | 'low'}[]) => {
    const priorityMap = { "high": 1, "medium": 2, "low": 3 };

    tasks.sort((a, b) => {
        if (priorityMap[a.priority] !== priorityMap[b.priority]) {
            return priorityMap[a.priority] - priorityMap[b.priority];
        }

        return a.deadline.getTime() - b.deadline.getTime();
    });

    tasks_file.default.canvas_todos = tasks;
}

for (const eventID in events){
  const event = events[eventID];
  if (event.type == 'VEVENT' && event.uid.includes('event-assignment') && !event.uid.includes('event-assignment-override')){
    let {summary, start, url: {val}} = event;

    if (!classifyOverdue(start)){
        let task_object = {id: random(4), title: summary, deadline: start, url: val, priority: classifyPriority(start)};
        tasks_file.default.canvas_todos.push(task_object)
    }
  }
}

sortBasedOnPriority(tasks_file.default.canvas_todos);
await Deno.writeTextFile(`${Deno.env.get("HOME")}/todos.json`, JSON.stringify(tasks_file.default));