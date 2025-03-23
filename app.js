(function () {
  // Select elements from the DOM
  const form = document.querySelector(".task-form");
  const alert = document.querySelector(".alert");
  const taskInput = document.getElementById("task");
  const submitBtn = document.querySelector(".submit-btn");
  const container = document.querySelector(".task-container");
  const list = document.querySelector(".task-list");
  const clearBtn = document.querySelector(".clear-btn");

  // Variables for editing tasks
  let editElement = null;
  let editFlag = false;
  let editID = "";

  // Event listener for form submission
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Prevent the form from refreshing the page
    const value = taskInput.value.trim();
    const id = new Date().getTime().toString();

    if (value === "") {
      // If the input is empty, show an alert
      showAlert("Please enter a task", "danger");
    } else if (editFlag) {
      // If editing, update the task
      editElement.textContent = value;
      showAlert("Task updated", "success");
      updateTaskInLocalStorage(editID, value);
      resetForm();
    } else {
      // If adding a new task, create the task element
      const task = document.createElement("article");
      task.className = "task-item";
      task.setAttribute("data-id", id);
      task.innerHTML =
        '<input type="checkbox" class="checkbox" />' +
        '<p class="title">' +
        value +
        "</p>" +
        '<div class="btn-container">' +
        '<button class="delete-btn">Delete</button>' +
        "</div>";
      list.appendChild(task);
      showAlert("Task added", "success");
      addTaskToLocalStorage(id, value);
      resetForm();
    }
    checkTasks();
  });

  // Event listener for task actions
  list.addEventListener("click", function (e) {
    if (e.target.classList.contains("delete-btn")) {
      const task = e.target.closest(".task-item");
      const id = task.getAttribute("data-id");
      list.removeChild(task);
      showAlert("Task removed", "danger");
      removeTaskFromLocalStorage(id);
      checkTasks();
    } else if (e.target.classList.contains("checkbox")) {
      // If the checkbox is clicked, toggle task completion
      const task = e.target.closest(".task-item");
      const id = task.getAttribute("data-id");
      if (task.classList.contains("completed")) {
        task.classList.remove("completed");
      } else {
        task.classList.add("completed");
      }
      toggleTaskCompletionInLocalStorage(id); // Update completion status in local storage
      showAlert("Task status updated", "success");
    }
  });

  // Event listener for clearing all tasks
  clearBtn.addEventListener("click", function () {
    list.innerHTML = "";
    showAlert("All tasks cleared", "danger");
    localStorage.removeItem("tasks");
    checkTasks();
  });

  // Load tasks from local storage when the page loads
  window.addEventListener("DOMContentLoaded", function () {
    const tasks = getTasksFromLocalStorage();
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const taskElement = document.createElement("article");
      taskElement.className = "task-item";
      if (task.completed) {
        taskElement.className += " completed";
      }
      taskElement.setAttribute("data-id", task.id);
      taskElement.innerHTML =
        '<input type="checkbox" class="checkbox" ' +
        (task.completed ? "checked" : "") +
        " />" +
        '<p class="title">' +
        task.value +
        "</p>" +
        '<div class="btn-container">' +
        '<button class="delete-btn">Delete</button>' +
        "</div>";
      list.appendChild(taskElement);
    }
    checkTasks();
  });

  // Show an alert message
  function showAlert(message, type) {
    alert.textContent = message;
    alert.className = "alert alert-" + type;
    setTimeout(function () {
      alert.textContent = "";
      alert.className = "alert";
    }, 1000);
  }

  // Reset the form to its default state
  function resetForm() {
    taskInput.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "Add Task";
  }

  // Check if there are tasks and update the UI
  function checkTasks() {
    if (list.children.length > 0) {
      // If there are tasks, show the container and clear button
      if (!container.classList.contains("show-container")) {
        container.classList.add("show-container");
      }
      clearBtn.style.display = "block";
    } else {
      // If no tasks, hide the container and clear button
      if (container.classList.contains("show-container")) {
        container.classList.remove("show-container");
      }
      clearBtn.style.display = "none";
    }
  }

  // Get tasks from local storage
  function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
  }

  // Add a task to local storage
  function addTaskToLocalStorage(id, value) {
    const tasks = getTasksFromLocalStorage();
    tasks.push({ id: id, value: value, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Remove a task from local storage
  function removeTaskFromLocalStorage(id) {
    const tasks = getTasksFromLocalStorage();
    const filteredTasks = [];
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id !== id) {
        filteredTasks.push(tasks[i]);
      }
    }
    localStorage.setItem("tasks", JSON.stringify(filteredTasks));
  }

  // Toggle task completion in local storage
  function toggleTaskCompletionInLocalStorage(id) {
    const tasks = getTasksFromLocalStorage();
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === id) {
        tasks[i].completed = !tasks[i].completed;
        break;
      }
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Update a task in local storage
  function updateTaskInLocalStorage(id, value) {
    const tasks = getTasksFromLocalStorage();
    for (let i = 0; i < tasks.length; i++) {
      if (tasks[i].id === id) {
        tasks[i].value = value;
        break;
      }
    }
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
})();
