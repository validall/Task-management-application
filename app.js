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
  form.addEventListener("submit", handleFormSubmit);

  // Event listener for task actions
  list.addEventListener("click", handleTaskActions);

  // Event listener for clearing all tasks
  clearBtn.addEventListener("click", clearAllTasks);

  // Load tasks from local storage when the page loads
  window.addEventListener("DOMContentLoaded", loadTasks);

  function handleFormSubmit(e) {
    e.preventDefault();
    const value = taskInput.value.trim();
    const id = new Date().getTime().toString();

    if (!value) {
      showAlert("Please enter a task", "danger");
    } else if (editFlag) {
      editElement.textContent = value;
      showAlert("Task updated", "success");
      updateTaskInLocalStorage(editID, value);
      resetForm();
    } else {
      createTaskElement(id, value, false);
      showAlert("Task added", "success");
      addTaskToLocalStorage(id, value);
      resetForm();
    }
    checkTasks();
  }

  function handleTaskActions(e) {
    const task = e.target.closest(".task-item");
    if (!task) return; // Exit if no task is found
    const id = task.getAttribute("data-id");

    if (e.target.classList.contains("delete-btn")) {
      list.removeChild(task);
      showAlert("Task removed", "danger");
      removeTaskFromLocalStorage(id);
    } else if (e.target.classList.contains("checkbox")) {
      const isCompleted = task.classList.toggle("completed");
      toggleTaskCompletionInLocalStorage(id);
      showAlert(
        `Task marked as ${isCompleted ? "completed" : "incomplete"}`,
        "success"
      );
    }
    checkTasks();
  }

  function clearAllTasks() {
    list.innerHTML = "";
    showAlert("All tasks cleared", "danger");
    localStorage.removeItem("tasks");
    checkTasks();
  }

  function loadTasks() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(({ id, value, completed }) =>
      createTaskElement(id, value, completed)
    );
    checkTasks();
  }

  function createTaskElement(id, value, completed) {
    const task = document.createElement("article");
    task.className = `task-item${completed ? " completed" : ""}`;
    task.setAttribute("data-id", id);
    task.innerHTML = `
      <input type="checkbox" class="checkbox" ${completed ? "checked" : ""} />
      <p class="title">${value}</p>
      <div class="btn-container">
        <button class="delete-btn">Delete</button>
      </div>`;
    list.appendChild(task);
  }

  function showAlert(message, type) {
    alert.textContent = message;
    alert.className = `alert alert-${type}`;
    setTimeout(() => {
      alert.textContent = "";
      alert.className = "alert";
    }, 1000);
  }

  function resetForm() {
    taskInput.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "Add Task";
  }

  function checkTasks() {
    const hasTasks = list.children.length > 0;
    container.classList.toggle("show-container", hasTasks);
    clearBtn.style.display = hasTasks ? "block" : "none";
  }

  function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
  }

  function addTaskToLocalStorage(id, value) {
    const tasks = getTasksFromLocalStorage();
    tasks.push({ id, value, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function removeTaskFromLocalStorage(id) {
    const tasks = getTasksFromLocalStorage().filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function toggleTaskCompletionInLocalStorage(id) {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach((task) => {
      if (task.id === id) task.completed = !task.completed;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateTaskInLocalStorage(id, value) {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach((task) => {
      if (task.id === id) task.value = value;
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
})();
