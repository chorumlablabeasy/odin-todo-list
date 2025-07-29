// AppManager.js
import { Todo } from "./todo";
import { Project } from "./project";
import { UIManager } from "./UIManager";

export const AppManager = (function () {
    let projects = [];
    let currentProject = null;

    // Helper function for local storage
    const saveProjects = () => {
        localStorage.setItem('projects', JSON.stringify(projects));
    };

    const loadProjects = () => {
        const storedProjects = JSON.parse(localStorage.getItem('projects'));
        if (storedProjects) {
            // Restore Project and Todo instances from plain objects
            projects = storedProjects.map(p => {
                const project = new Project(p.title, p.isDeletable);
                project.id = p.id; // Restore ID
                project.todos = p.todos.map(t => {
                    const todo = new Todo(t.title, t.description, t.dueDate, t.priority);
                    todo.id = t.id; // Restore ID
                    todo.completed = t.completed;
                    return todo;
                });
                return project;
            });
        }
    };

    // Functions related to Projects
    const addProject = (title) => {
        const newProject = new Project(title);
        projects.push(newProject);
        saveProjects(); // Save after adding
        UIManager.renderProjects(projects); // Pass projects to UIManager
    };

    const deleteProject = (projectId) => {
        const index = projects.findIndex(project => project.id === projectId);
        if (index !== -1) {
            // If the current project is deleted, set it back to Inbox or null
            if (currentProject && currentProject.id === projectId) {
                currentProject = projects.find(p => p.title === "Inbox") || null; // Fallback to Inbox
            }
            projects.splice(index, 1);
            saveProjects(); // Save after deleting
            UIManager.renderProjects(projects); // Pass projects to UIManager
            UIManager.renderTodos(currentProject ? currentProject.getTodos() : []); // Re-render todos of the new current project
        }
    }

    const getCurrentProject = () => currentProject;

    const setCurrentProject = (projectId) => {
        currentProject = projects.find(project => project.id === projectId);
        UIManager.updateCurrentProjectTitle(currentProject.title); // Update main title
        UIManager.highlightActiveProject(projectId); // Highlight in UI
        UIManager.renderTodos(currentProject.getTodos()); // Render todos of the newly selected project
    }

    //Functions related to Todos
    const addTodo = (newTodo) => {
        if (!currentProject) {
            console.error("No project selected to add todo.");
            return;
        }
        currentProject.addTodo(newTodo); // Using the addTodo method from Project class
        saveProjects(); // Save after adding
        UIManager.renderTodos(currentProject.getTodos()); // Re-render current project's todos
    };

    const editTodo = (todo, newTitle, newDescription, newDueDate, newPriority) => {
        todo.title = newTitle;
        todo.description = newDescription;
        todo.dueDate = new Date(newDueDate); // Ensure Date object
        todo.priority = newPriority;
        saveProjects(); // Save after editing
        UIManager.renderTodos(currentProject.getTodos()); // Re-render to reflect changes
    }

    const getTodoById = (todoId) => {
        // This function is still useful for finding a specific todo across all projects
        for (const project of projects) {
            const foundTodo = project.todos.find(todo => todo.id === todoId);
            if (foundTodo) {
                return foundTodo;
            }
        }
        return null;
    }

    const initialize = () => {
        loadProjects(); // Load existing projects from storage

        // If no projects, create Inbox as default
        if (projects.length === 0) {
            const inbox = new Project("Inbox", false);
            projects.push(inbox);
        }
        
        // Set Inbox as the initial current project if no other is set or loaded
        if (!currentProject) {
            currentProject = projects.find(p => p.title === "Inbox");
        }
        
        UIManager.renderProjects(projects); // Render all projects
        if (currentProject) {
            UIManager.highlightActiveProject(currentProject.id); // Highlight default project
            UIManager.updateCurrentProjectTitle(currentProject.title); // Set current project title
            UIManager.renderTodos(currentProject.getTodos()); // Render initial todos
        }

        // --- Dialog Event Listeners ---

        // Project Dialog Submit
        const addProjectForm = document.getElementById("add-project-form");
        addProjectForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const projectTitleInput = document.getElementById("project-title");
            AppManager.addProject(projectTitleInput.value);
            addProjectForm.reset();
            document.getElementById("add-project-dialog").close();
            UIManager.renderProjects(projects); // Re-render projects after adding
            UIManager.highlightActiveProject(currentProject.id); // Keep the active project highlighted
        });

        // Project Dialog Cancel
        document.getElementById("add-project-cancel-btn").addEventListener("click", () => {
            document.getElementById("add-project-form").reset();
            document.getElementById("add-project-dialog").close();
        });

        // Todo Dialog Submit
        const addTodoForm = document.getElementById("add-todo-form");
        addTodoForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const todoTitleInput = document.getElementById("todo-title");
            const todoDescriptionInput = document.getElementById("todo-description");
            const todoDueDateInput = document.getElementById("todo-due-date");
            const todoPriorityInput = document.getElementById("todo-priority");
            const submitBtn = document.getElementById("todo-form-submit-btn");

            if (submitBtn.textContent === "Save") { // Edit mode
                const todoIdToEdit = addTodoForm.dataset.editingTodoId;
                const todoToEdit = AppManager.getTodoById(todoIdToEdit);
                if (todoToEdit) {
                    AppManager.editTodo(
                        todoToEdit,
                        todoTitleInput.value,
                        todoDescriptionInput.value,
                        todoDueDateInput.value,
                        todoPriorityInput.value
                    );
                }
            } else { // Add mode
                const newTodo = new Todo(
                    todoTitleInput.value,
                    todoDescriptionInput.value,
                    todoDueDateInput.value,
                    todoPriorityInput.value
                );
                AppManager.addTodo(newTodo);
            }
            addTodoForm.reset();
            document.getElementById("add-todo-dialog").close();
            UIManager.renderTodos(currentProject.getTodos()); // Re-render todos after add/edit
        });

        // Todo Dialog Cancel
        document.getElementById("add-todo-cancel-btn").addEventListener("click", () => {
            document.getElementById("add-todo-form").reset();
            document.getElementById("add-todo-dialog").close();
        });

        // Initial button click listeners
        document.getElementById("add-project-btn").addEventListener("click", () => {
            UIManager.showProjectDialog();
        });

        document.getElementById("add-todo-btn").addEventListener("click", () => {
            UIManager.showTodoDialog();
        });
    };

    return {
        addProject,
        deleteProject,
        getCurrentProject,
        setCurrentProject,
        editTodo,
        getTodoById,
        addTodo,
        initialize,
        saveProjects
    }
})();