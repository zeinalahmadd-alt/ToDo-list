let input=document.getElementById("task-input");
let descriptionInput=document.getElementById("task-description-input");
// 

function addTaskToDOM(tasks) {
    const taskItem = document.createElement("li");

    taskItem.classList.add("task-item");

    if (tasks.completed) {
        taskItem.classList.add("completed");
    }

    taskItem.innerHTML =`
    <div class="task-content"> 
        <input type="checkbox" class="task-checkbox" ${tasks.completed ? "checked" : ""}>
        <span class="task-label">${tasks.text}</span>
    </div>
    <div class="task-actions">
        <button class="btn btn-edit">Edit</button>
        <button class="btn btn-delete">Delete</button>
    </div>
    <div class="task-description">${tasks.description ? tasks.description : ""}</div>`
    ;

    taskList.appendChild(taskItem);
};



let addBtn=document.getElementById("add-task-btn");
let allBtn=document.getElementById("filter-all");
let activeBtn=document.getElementById("filter-active");
let completedBtn=document.getElementById("filter-completed");
let clearCompletedBtn=document.getElementById("clear-completed-btn");
let taskList=document.getElementById("task-list");
let taskCount=document.getElementById("task-count"); 
let themeToggleBtn=document.getElementById("theme-toggle-btn");
let themeToggleIcon=document.getElementById("theme-toggle-icon");
updateTaskCount();

// Array to store tasks
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
tasks.forEach(task => {
    addTaskToDOM(task);
});
updateTaskCount();

// Helper: keep localStorage always in sync with the tasks array
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Helper: find the tasks array index for a given task-item DOM element
function getTaskIndex(taskItem) {
    return Array.prototype.indexOf.call(taskList.children, taskItem);
}

// Add Task
addBtn.addEventListener("click", function(e) {
    e.preventDefault();
    // Task addition logic here
    if(input.value !==""){
        const newtask = {
            text: input.value,
            description: descriptionInput ? descriptionInput.value : "",
            completed: false,
        };
        tasks.push(newtask);
        saveTasks();
        addTaskToDOM(newtask); 
        // Clear input value
        input.value = "";
        if (descriptionInput) {
            descriptionInput.value = "";
        }
        // Update task count
        updateTaskCount();
    }
});

//CheckBox task
taskList.addEventListener("change",function(e){
    if(e.target.classList.contains("task-checkbox")){
    const taskItem = e.target.closest(".task-item");
    taskItem.classList.toggle("completed", e.target.checked);
    const index = getTaskIndex(taskItem);
    if (tasks[index]) {
        tasks[index].completed = e.target.checked;
        saveTasks();
    }
    }
    updateTaskCount();    
});

// delete task
taskList.addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-delete")) {
        const taskItem = e.target.closest(".task-item");
        const index = getTaskIndex(taskItem);
        if (index > -1) {
            tasks.splice(index, 1);
            saveTasks();
        }
        taskList.removeChild(taskItem);
    }
    updateTaskCount();
});

//Edit task
taskList.addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-edit")) {      
        const taskItem = e.target.closest(".task-item");
        const taskLabel = taskItem.querySelector(".task-label");
        const newTaskText = prompt("Edit task:", taskLabel.textContent);
        if (newTaskText !== null) {
            taskLabel.textContent = newTaskText;
            const index = getTaskIndex(taskItem);
            if (tasks[index]) {
                tasks[index].text = newTaskText;
                saveTasks();
            }
        }
    }
    updateTaskCount();
});

// Toggle task description on tap/click of the task content (but not on
// checkbox/edit/delete clicks), and on double-tap for mobile.
taskList.addEventListener("click", function(e) {
    if (e.target.classList.contains("btn-delete") || e.target.classList.contains("btn-edit")) {
        return;
    }
    if (e.target.classList.contains("task-checkbox")) {
        return;
    }
    const taskContent = e.target.closest(".task-content");
    if (!taskContent) {
        return;
    }
    const taskItem = taskContent.closest(".task-item");
    const description = taskItem.querySelector(".task-description");
    if (description && description.textContent.trim() !== "") {
        description.classList.toggle("open");
    }
});

// Double Tap (dblclick) on the task toggles completed <-> active on mobile,
// without breaking Edit/Delete/Checkbox/filters.
taskList.addEventListener("dblclick", function(e) {
    if (e.target.classList.contains("btn-delete") || e.target.classList.contains("btn-edit")) {
        return;
    }
    if (e.target.classList.contains("task-checkbox")) {
        return;
    }
    const taskItem = e.target.closest(".task-item");
    if (!taskItem) {
        return;
    }
    const checkbox = taskItem.querySelector(".task-checkbox");
    const newCompleted = !checkbox.checked;
    checkbox.checked = newCompleted;
    taskItem.classList.toggle("completed", newCompleted);
    const index = getTaskIndex(taskItem);
    if (tasks[index]) {
        tasks[index].completed = newCompleted;
        saveTasks();
    }
    updateTaskCount();
});

// Filter tasks
let filterButtons = document.querySelectorAll(".btn-filter");
filterButtons.forEach(element => {
    if(element.id === "filter-all"){
        element.addEventListener("click", function() {
            taskList.querySelectorAll(".task-item").forEach(task => {
                task.style.display = "flex";
            });
            filterButtons.forEach(btn => btn.classList.remove("active"));
            element.classList.add("active");
        });
    }
    if(element.id === "filter-active"){
        element.addEventListener("click", function() {
            taskList.querySelectorAll(".task-item").forEach(task => {
                if (!task.classList.contains("completed")) {
                    task.style.display = "flex";
                } else {
                    task.style.display = "none";
                }
            });
            filterButtons.forEach(btn => btn.classList.remove("active"));
            element.classList.add("active");
        });
    }
    if(element.id === "filter-completed"){
        element.addEventListener("click", function() {
            taskList.querySelectorAll(".task-item").forEach(task => {
                if (task.classList.contains("completed")) {
                    task.style.display = "flex";
                } else {
                    task.style.display = "none";
                }
            });
            filterButtons.forEach(btn => btn.classList.remove("active"));
            element.classList.add("active");
        });
    }
});

//task count
function updateTaskCount() {
    const totalTasks = taskList.querySelectorAll(".task-item").length;
    const completedTasks = taskList.querySelectorAll(".task-item.completed").length;
    const remainingTasks = totalTasks - completedTasks;
    taskCount.textContent = `${totalTasks} tasks • ${remainingTasks} Remaining`;
}

// Dark Mode / Theme
function applyTheme(theme) {
    if (theme === "dark") {
        document.documentElement.setAttribute("data-theme", "dark");
        if (themeToggleIcon) themeToggleIcon.textContent = "☀️";
    } else {
        document.documentElement.setAttribute("data-theme", "light");
        if (themeToggleIcon) themeToggleIcon.textContent = "🌙";
    }
}

const savedTheme = localStorage.getItem("theme") || "dark";
applyTheme(savedTheme);

if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function() {
        const currentTheme = document.documentElement.getAttribute("data-theme");
        const newTheme = currentTheme === "dark" ? "light" : "dark";
        applyTheme(newTheme);
        localStorage.setItem("theme", newTheme);
    });
}

//  local storage
// const tasksss=[{
//     text:"Sample Task",
//     completed:false
//     },
//     {text:"Another Task",
//     completed:true
//     },
//     {text:"Third Task",
//     completed:false
//     }  
// ];
// localStorage.setItem("tasks",JSON.stringify(tasks));
// const savedTaskss=JSON.parse(localStorage.getItem("tasks"));
// console.log(savedTasks);
