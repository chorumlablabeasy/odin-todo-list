class Todo {
    constructor(title, description, dueDate, priority) {
        this.id = Date.now().toString();
        this.title = title;
        this.description = description;
        this.dueDate = new Date(dueDate);
        this.priority = priority;
        this.completed = false;
    }

    todoCompleteToggle() {
        this.completed = !this.completed;
    }

    updateTodo() {
        this.title = newTitle;
        this.description = newDescription;
        this.dueDate = newDueDate;
        this.priority = newPriority;
    }

}

export { Todo }