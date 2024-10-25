import chalk from 'npm:chalk';

export default class Task{
    title: string;
    deadline: Date;
    url: string;
    priority: string;

    constructor(title: string, deadline: Date, url: string, priority: string){
        this.title = title;
        this.deadline = deadline;
        this.url = url;
        this.priority = priority;
    }

    toString(): string {
        if (this.priority == 'high'){
            return `Title: ${this.title}\nDeadline: ${this.deadline}\nURL: ${this.url}\nPriority: ${chalk.red(this.priority)}`;
        }else if(this.priority == 'medium'){
            return `Title: ${this.title}\nDeadline: ${this.deadline}\nURL: ${this.url}\nPriority: ${chalk.magenta(this.priority)}`;
        }else{
            return `Title: ${this.title}\nDeadline: ${this.deadline}\nURL: ${this.url}\nPriority: ${chalk.green(this.priority)}`;
        }
    }
            
}


  