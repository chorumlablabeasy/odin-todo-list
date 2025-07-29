class Project {
    constructor(title, isDeletable = true) {
        this.id = Date.now().toString();
        this.isDeletable = isDeletable;
        this.title = title;
        this.todos = [];
    }

    addTodo(todo) {
        this.todos.push(todo);
    }

    deleteTodo(todoId) {
        const index = this.todos.findIndex(todo => todo.id === todoId);
        if (index !== -1) {
            this.todos.splice(index, 1);
        }
    }

    getTodos() {
        return [...this.todos];
    }
}

export { Project }