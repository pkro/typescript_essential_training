enum Status {
    Done = "done",
    InProgress = "in-progress",
    Todo = "todo",
}

interface ITodoItem {
    id: number,
    title: string,
    status: Status,
    completedOn?: Date
}

const todoItems: ITodoItem[] = [
    { id: 1, title: "Learn HTML", status: Status.Done, completedOn: new Date("2021-09-11") },
    { id: 2, title: "Learn TypeScript", status: Status.InProgress },
    { id: 3, title: "Write the best app in the world", status: Status.Todo },
]



function addTodoItem(todo: string): ITodoItem {
    const id = getNextId<ITodoItem, number>(todoItems)

    const newTodo = {
        id,
        title: todo,
        status: Status.Todo,
    }

    todoItems.push(newTodo)

    return newTodo
}

function getNextId<T extends { id: number }, U>(items: T[]): number {
    return items.reduce((max, x) => x.id > max ? max : x.id, 0) + 1
}

const newTodo = addTodoItem("Buy lots of stuff with all the money we make from the app")

console.log(JSON.stringify(newTodo))
