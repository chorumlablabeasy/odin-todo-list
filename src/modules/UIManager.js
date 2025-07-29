// UIManager.js
import { AppManager } from "./AppManager.js";
import { Todo } from "./todo.js";
import { Project } from "./project.js";

export const UIManager = (function () {

    const showProjectDialog = () => {
        const projectDialog = document.getElementById("add-project-dialog");
        const projectForm = document.getElementById("add-project-form");
        projectForm.reset(); // Reset the form every time it opens
        projectDialog.showModal();
    };

    const showTodoDialog = (mode = "add", todoToEdit = null) => {
        const todoDialog = document.getElementById("add-todo-dialog");
        const todoForm = document.getElementById("add-todo-form");
        const dialogTitle = document.getElementById("add-todo-form-title");
        const todoFormSubmitBtn = document.getElementById("todo-form-submit-btn");
        const todoTitleInput = document.getElementById("todo-title");
        const todoDescriptionInput = document.getElementById("todo-description");
        const todoDueDateInput = document.getElementById("todo-due-date");
        const todoPriorityInput = document.getElementById("todo-priority");

        if (mode === "edit" && todoToEdit) {
            dialogTitle.textContent = "Edit Todo";
            todoFormSubmitBtn.textContent = "Save";
            todoTitleInput.value = todoToEdit.title;
            todoDescriptionInput.value = todoToEdit.description;
            // Format the date for input[type="date"]
            todoDueDateInput.value = todoToEdit.dueDate ? new Date(todoToEdit.dueDate).toISOString().split('T')[0] : '';
            todoPriorityInput.value = todoToEdit.priority;
            todoForm.dataset.editingTodoId = todoToEdit.id; // Store ID for submit listener
        } else {
            dialogTitle.textContent = "Add Todo";
            todoFormSubmitBtn.textContent = "Add Todo";
            todoForm.reset();
            delete todoForm.dataset.editingTodoId; // Clear editing ID
        }
        todoDialog.showModal();
    };

    // Projects
    const renderProjects = (projects) => { // Pass projects data from AppManager
        const projectsUL = document.getElementById("projects-list");
        projectsUL.innerHTML = "";

        projects.forEach((project) => {
            const newLi = document.createElement("li");
            newLi.classList.add("project-item");
            newLi.dataset.projectId = project.id;

            // Project link click listener
            const link = document.createElement("a");
            link.classList.add("project-link");
            link.href = "#";
            link.textContent = project.title;
            link.addEventListener("click", (e) => {
                e.preventDefault(); // Prevent default link behavior
                AppManager.setCurrentProject(project.id);
            });
            newLi.appendChild(link);

            // Delete button for deletable projects
            if (project.isDeletable) {
                const projectDeleteBtn = document.createElement("button");
                projectDeleteBtn.classList.add("delete-project-btn");
                projectDeleteBtn.innerHTML = "&times;";
                projectDeleteBtn.addEventListener("click", (e) => {
                    e.stopPropagation(); // Prevent triggering the project link click
                    AppManager.deleteProject(project.id);
                });
                newLi.appendChild(projectDeleteBtn);
            }
            projectsUL.appendChild(newLi);
        });
        highlightActiveProject(AppManager.getCurrentProject() ? AppManager.getCurrentProject().id : null);
    };

    const highlightActiveProject = (projectId) => {
        document.querySelectorAll(".project-link").forEach(link => {
            link.classList.remove("active");
        });
        const activeLink = document.querySelector(`.project-item[data-project-id="${projectId}"] .project-link`);
        if (activeLink) {
            activeLink.classList.add("active");
        }
    };

    const updateCurrentProjectTitle = (title) => {
        document.getElementById("current-project-title").textContent = title;
    };

    // Todos
    const renderTodos = (todos) => { // Pass todos data from AppManager
        const todosContainer = document.getElementById("todos-container");
        todosContainer.innerHTML = "";

        if (!todos || todos.length === 0) {
            const noTodosMessage = document.createElement("p");
            noTodosMessage.textContent = "No todos for this project yet!";
            todosContainer.appendChild(noTodosMessage);
            return;
        }

        todos.forEach((todo) => {
            const todoItem = document.createElement("div");
            todoItem.dataset.todoId = todo.id;
            todoItem.classList.add("todo-item");

            // Add priority class
            todoItem.classList.remove("priority-low", "priority-medium", "priority-high");
            if (todo.priority === "low") {
                todoItem.classList.add("priority-low");
            } else if (todo.priority === "medium") {
                todoItem.classList.add("priority-medium");
            } else {
                todoItem.classList.add("priority-high");
            }

            // Completed status
            if (todo.completed) {
                todoItem.classList.add("completed");
            }

            // Todo's Content
            const todoContentDiv = document.createElement("div");
            todoContentDiv.classList.add("todo-item-content");

            const todoTitle = document.createElement("h3");
            todoTitle.textContent = todo.title;

            const todoDescription = document.createElement("p");
            todoDescription.textContent = todo.description;

            const todoDueDate = document.createElement("div");
            todoDueDate.classList.add("todo-due-date");
            // Format date for display
            todoDueDate.textContent = `Due: ${todo.dueDate ? new Date(todo.dueDate).toLocaleDateString('tr-TR') : 'N/A'}`;


            todoContentDiv.appendChild(todoTitle);
            todoContentDiv.appendChild(todoDescription);
            todoContentDiv.appendChild(todoDueDate);

            // Todo's Actions
            const todoActionsDiv = document.createElement("div");
            todoActionsDiv.classList.add("todo-actions");

            const todoCheckbox = document.createElement("input");
            todoCheckbox.type = "checkbox";
            todoCheckbox.checked = todo.completed; // Set initial checked state

            todoCheckbox.addEventListener("change", () => {
                todo.completed = todoCheckbox.checked; // Update todo object's completed status
                if (todo.completed) {
                    todoItem.classList.add("completed");
                } else {
                    todoItem.classList.remove("completed");
                }
                // Also save this change to local storage
                AppManager.saveProjects(); // Assuming saveProjects is exposed or called from AppManager after todo change
            });

            const todoEditBtn = document.createElement("button");
            todoEditBtn.classList.add("edit-todo-btn");
            todoEditBtn.textContent = "✏️";
            todoEditBtn.addEventListener("click", () => {
                showTodoDialog("edit", todo);
            });

            const todoDeleteBtn = document.createElement("button");
            todoDeleteBtn.classList.add("delete-todo-btn");
            todoDeleteBtn.textContent = "🗑️";
            todoDeleteBtn.addEventListener("click", () => {
                AppManager.getCurrentProject().deleteTodo(todo.id); // Delete from current project
                AppManager.saveProjects(); // Save after deletion
                renderTodos(AppManager.getCurrentProject().getTodos()); // Re-render current todos
            });

            todoActionsDiv.appendChild(todoCheckbox);
            todoActionsDiv.appendChild(todoEditBtn);
            todoActionsDiv.appendChild(todoDeleteBtn);

            todoItem.appendChild(todoContentDiv);
            todoItem.appendChild(todoActionsDiv);
            todosContainer.appendChild(todoItem);
        });
    };

    return {
        showProjectDialog,
        showTodoDialog,
        renderProjects,
        renderTodos,
        highlightActiveProject,
        updateCurrentProjectTitle
    };
})();
