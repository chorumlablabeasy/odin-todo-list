class Project {
    constructor(title) {
        this.id = Date.now().toString();
        this.isDeletable = true;
        this.title = title;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    deleteTodo(todoId) {
        this.todos = this.todos.filter(todo => todo.id !== todoId);
    }
}

export { Project }