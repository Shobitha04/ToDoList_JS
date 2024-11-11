window.onload = function () {
    loadTasks();

    document.getElementById("new-task").addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            addTask();
        }
    });
};

function addTask() {
    const taskText = document.getElementById("new-task").value;
    if (taskText) {
        if (isDuplicateTask(taskText)) {
            alert("Error: No duplicate tasks allowed!");
        } else {
            const task = {
                text: taskText,
                status: "todo",
                createdAt: new Date().toLocaleString()
            };
            saveTask(task);
            document.getElementById("new-task").value = "";
            displayTasks();
        }
    }
}

function isDuplicateTask(taskText) {
    const allTasks = [
        ...JSON.parse(localStorage.getItem("todoTasks")) || [],
        ...JSON.parse(localStorage.getItem("inProcessTasks")) || [],
        ...JSON.parse(localStorage.getItem("completedTasks")) || []
    ];

    return allTasks.some(task => task.text === taskText);
}

function loadTasks() {
    const todoTasks = JSON.parse(localStorage.getItem("todoTasks")) || [];
    const inProcessTasks = JSON.parse(localStorage.getItem("inProcessTasks")) || [];
    const completedTasks = JSON.parse(localStorage.getItem("completedTasks")) || [];

    displayList("todo-list", todoTasks);
    displayList("in-process-list", inProcessTasks);
    displayList("completed-list", completedTasks);
}

function saveTask(task) {
    const status = task.status;
    let tasks = JSON.parse(localStorage.getItem(`${status}Tasks`)) || [];
    tasks.push(task);
    localStorage.setItem(`${status}Tasks`, JSON.stringify(tasks));
}

function displayTasks() {
    document.getElementById("todo-list").innerHTML = "";
    document.getElementById("in-process-list").innerHTML = "";
    document.getElementById("completed-list").innerHTML = "";

    loadTasks();
}

function displayList(elementId, tasks) {
    const list = document.getElementById(elementId);
    tasks.forEach(task => {
        const listItem = document.createElement("li");
        const taskText = document.createElement("span");
        taskText.innerText = `${task.text} (Created: ${task.createdAt})`;
        listItem.appendChild(taskText);

        const buttonGroup = document.createElement("div");
        buttonGroup.className = "button-group";

        const editButton = createButton("Edit", () => editTask(task));
        buttonGroup.appendChild(editButton);

        if (elementId === "todo-list") {
            const moveToInProcessBtn = createButton("Move to In Process", () => moveTask(task, "inProcess"));
            const moveToCompletedBtn = createButton("Move to Completed", () => moveTask(task, "completed"));
            buttonGroup.appendChild(moveToInProcessBtn);
            buttonGroup.appendChild(moveToCompletedBtn);
        } else if (elementId === "in-process-list") {
            const moveToTodoBtn = createButton("Move to To Do", () => moveTask(task, "todo"));
            const moveToCompletedBtn = createButton("Move to Completed", () => moveTask(task, "completed"));
            buttonGroup.appendChild(moveToTodoBtn);
            buttonGroup.appendChild(moveToCompletedBtn);
        } else if (elementId === "completed-list") {
            const moveToTodoBtn = createButton("Move to To Do", () => moveTask(task, "todo"));
            const moveToInProcessBtn = createButton("Move to In Process", () => moveTask(task, "inProcess"));
            buttonGroup.appendChild(moveToTodoBtn);
            buttonGroup.appendChild(moveToInProcessBtn);
        }

        const deleteButton = createButton("X", () => showDeleteModal(task));
        deleteButton.style.backgroundColor = "#808080";
        deleteButton.style.color = "white";
        buttonGroup.appendChild(deleteButton);

        listItem.appendChild(buttonGroup);
        list.appendChild(listItem);
    });
}

function createButton(text, onClick) {
    const button = document.createElement("button");
    button.innerText = text;
    button.onclick = onClick;
    button.style.marginLeft = "5px";
    return button;
}

function moveTask(task, newStatus) {
    removeTask(task);
    task.status = newStatus;
    saveTask(task);
    displayTasks();
}

function removeTask(task) {
    const currentStatus = task.status + "Tasks";
    let tasks = JSON.parse(localStorage.getItem(currentStatus)) || [];
    tasks = tasks.filter(t => t.text !== task.text);
    localStorage.setItem(currentStatus, JSON.stringify(tasks));
}

function editTask(task) {
    const newText = prompt("Edit your task:", task.text);
    if (newText && newText.trim()) {
        removeTask(task);
        task.text = newText.trim();
        saveTask(task);
        displayTasks();
    }
}

function clearCompleted() {
    localStorage.removeItem("completedTasks");
    displayTasks();
}

function showDeleteModal(task) {
    const modal = document.getElementById("delete-modal");
    const cancelButton = document.getElementById("cancel-delete");
    const confirmButton = document.getElementById("confirm-delete");

    modal.style.display = "block";

    confirmButton.onclick = function() {
        removeTask(task);
        displayTasks();
        modal.style.display = "none";
    };

    cancelButton.onclick = function() {
        modal.style.display = "none";
    };
}

document.getElementById("cancel-delete").onclick = function () {
    const modal = document.getElementById("delete-modal");
    modal.style.display = "none";
};
