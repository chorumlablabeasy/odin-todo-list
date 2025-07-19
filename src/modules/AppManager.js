import { Todo } from "./todo";
import { Project } from "./project";

export const AppManager = (function () {
    let projects = [];

    // Functions related to Projects
    const addProject = (title) => {
        const newProject = new Project(title);
        projects.push(newProject);
    };

    const deleteProject = (projectId) => {
        projects = projects.filter((project) => project.id !== projectId);
    };

    // Functions related to Todos

    const initialize = () => {
        // Create inbox as a default
        const inbox = new Project("Inbox");
        inbox.isDeletable = false;
        let currentProject = inbox;

        // Add Project Dialog
        const projectDialog = document.getElementById("add-project-dialog");
        const projectForm = document.getElementById("add-project-form");
        const addProjectBtn = document.getElementById("add-project-btn");
        const cancelProjectBtn = document.getElementById("add-project-cancel-btn");

        addProjectBtn.addEventListener("click", () => {
            projectForm.reset();
            projectDialog.showModal();
        });

        cancelProjectBtn.addEventListener("click", () => {
            projectDialog.close();
        });

        const projectTitleInput = document.getElementById("project-title");

        projectForm.addEventListener("submit", (e) => {
            e.preventDefault();
            let projectTitle = projectTitleInput.value;
            addProject(projectTitle);
        });

        // Add Todo Dialog
        const todoDialog = document.getElementById("add-todo-dialog");
        const todoForm = document.getElementById("add-todo-form");
        const addTodoBtn = document.getElementById("add-todo-btn");
        const cancelTodoBtn = document.getElementById("add-todo-cancel-btn");

        addTodoBtn.addEventListener("click", () => {
            todoDialog.reset();
            todoDialog.showModal();
        });

        cancelTodoBtn.addEventListener("click", () => {
            todoDialog.close();
        });

        const todoTitleInput = document.getElementById("todo-title");
        const todoDescriptionInput = document.getElementById("todo-description");
        const todoDueDateInput = document.getElementById("todo-due-date");
        const todoPriorityInput = document.getElementById("todo-priority");

        todoForm.addEventListener("submit", (e) => {
            e.preventDefault();

            let todoTitle = todoTitleInput.value;
            let todoDescription = todoDescriptionInput.value;
            let todoDueDate = todoDueDateInput.value;
            let todoPriority = todoPriorityInput.value;

            // continue from here
        });
    };
})();
