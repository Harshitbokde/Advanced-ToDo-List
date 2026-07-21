const themeBtn = document.getElementById("themeBtn");
const allBtn = document.getElementById("allBtn");
const pendingBtn = document.getElementById("pendingBtn");
const completedBtn = document.getElementById("completedBtn");
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const searchInput = document.getElementById("searchInput");
const progress = document.getElementById("progress");
const progressText = document.getElementById("progressText");
const clearBtn = document.getElementById("clearBtn");

// Page load hote hi saved tasks dikhao
window.onload = function () {
    loadTasks();
};

// Add button click
addBtn.addEventListener("click", addTask);

// Enter key se bhi task add hoga
taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Task add function
function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task!");
        return;
    }

    createTask(taskText, false);

    saveTasks();
    updateProgress();

    taskInput.value = "";

}

// Task create function
function createTask(taskText, completed) {

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = taskText;

    if (completed) {
        span.classList.add("completed");
    }

    // Complete Task
    span.onclick = function () {
        span.classList.toggle("completed");
        saveTasks();
        updateProgress();
    };


    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";

    editBtn.onclick = function () {

        const newTask = prompt("Edit your task:", span.textContent);

        if (newTask !== null && newTask.trim() !== "") {
            span.textContent = newTask.trim();
            saveTasks();
            updateProgress();
        }

    };

    // Delete Button
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";

    deleteBtn.onclick = function () {
        li.remove();
        saveTasks();
        updateProgress();
    };

    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);

    taskList.appendChild(li);
}

// Save tasks in Local Storage
function saveTasks() {

    const tasks = [];

    document.querySelectorAll("#taskList li").forEach(function (li) {

        tasks.push({
            text: li.querySelector("span").textContent,
            completed: li.querySelector("span").classList.contains("completed")
        });

    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Load tasks after refresh
function loadTasks() {

    taskList.innerHTML = "";

    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    savedTasks.forEach(function (task) {
        createTask(task.text, task.completed);
    });

    updateProgress();
}

searchInput.addEventListener("keyup", function () {

    const searchValue = searchInput.value.toLowerCase();

    document.querySelectorAll("#taskList li").forEach(function (li) {

        const task = li.querySelector("span").textContent.toLowerCase();

        if (task.includes(searchValue)) {
            li.style.display = "flex";
        } else {
            li.style.display = "none";
        }

    });

});

allBtn.onclick = function () {

    document.querySelectorAll("#taskList li").forEach(function (li) {
        li.style.display = "flex";
    });

};

pendingBtn.onclick = function () {

    document.querySelectorAll("#taskList li").forEach(function (li) {

        const completed = li.querySelector("span").classList.contains("completed");

        li.style.display = completed ? "none" : "flex";

    });

};

completedBtn.onclick = function () {

    document.querySelectorAll("#taskList li").forEach(function (li) {

        const completed = li.querySelector("span").classList.contains("completed");

        li.style.display = completed ? "flex" : "none";

    });

};

themeBtn.onclick = function () {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
    } else {
        localStorage.setItem("theme", "light");
    }

};

// Page load hone par saved theme apply karo
if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
}

function updateProgress() {

    const total = document.querySelectorAll("#taskList li").length;

    const completed = document.querySelectorAll("#taskList .completed").length;

    progressText.textContent = `${completed} / ${total} Tasks Completed`;

    if (total === 0) {
        progress.style.width = "0%";
    } else {
        progress.style.width = (completed / total) * 100 + "%";
    }

}
clearBtn.onclick = function () {

    if (confirm("Are you sure you want to delete all tasks?")) {

        taskList.innerHTML = "";

        saveTasks();
        updateProgress();

    }

};