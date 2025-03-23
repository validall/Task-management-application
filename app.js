(function () {
  // Select Items
  const form = document.querySelector(".task-form");
  const alert = document.querySelector(".alert");
  const taskInput = document.getElementById("task");
  const submitBtn = document.querySelector(".submit-btn");
  const container = document.querySelector(".task-container");
  const list = document.querySelector(".task-list");
  const clearBtn = document.querySelector(".clear-btn");

  // State variables for editing
  let editElement = null;
  let editFlag = false;
  let editID = "";

  // Event Listeners
  form.addEventListener("submit", handleFormSubmit);
  clearBtn.addEventListener("click", clearTasks);
  list.addEventListener("click", handleTaskActions);
  window.addEventListener("DOMContentLoaded", setupTasks);

  // Handle Form  Submission
  function handleFormSubmit(e) {
    e.preventDefault();
    const value = taskInput.value.trim();
    const id = new Date().getTime().toString();

    if (!value) {
      displayAlert("Please enter a task", "danger");
      return;
    }

    // Check for duplicate task names
    const duplicate = Array.from(list.querySelectorAll(".title")).some(
      (item) => item.textContent === value
    );
    if (duplicate) {
      displayAlert("Task already exists", "danger");
      return;
    }

    if (editFlag) {
      // Update existing task
      editElement.textContent = value;
      displayAlert("Task updated", "success");
      updateLocalStorage(editID, value);
    } else {
      // Add new task
      createTaskItem(id, value);
      displayAlert("Task added", "success");
      addToLocalStorage(id, value);
    }

    setBackToDefault();
    checkTaskState();
  }

  // Handle Task Actions (complete/remove)
  function handleTaskActions(e) {
    const element = e.target.closest(".task-item");
    const id = element.dataset.id;

    if (e.target.classList.contains("delete-btn")) {
      list.removeChild(element);
      removeFromLocalStorage(id);
      displayAlert("Task removed", "danger");
    } else if (e.target.classList.contains("complete-btn")) {
      element.classList.toggle("completed");
      toggleCompleteInLocalStorage(id);
      displayAlert("Task status updated", "success");
    }

    checkTaskState();
  }

  // Display Alert Message
  function displayAlert(message, type) {
    alert.textContent = message;
    alert.className = `alert alert-${type}`;
    setTimeout(() => (alert.textContent = ""), 1000);
  }

  // Clear All Tasks
  function clearTasks() {
    list.innerHTML = "";
    container.classList.remove("show-container");
    localStorage.removeItem("tasks");
    displayAlert("All tasks cleared", "danger");
    setBackToDefault();
    checkTaskState();
  }

  // Reset Form State
  function setBackToDefault() {
    taskInput.value = "";
    editFlag = false;
    editID = "";
    submitBtn.textContent = "Add Task";
  }

  // Create New Task Item
  function createTaskItem(id, value, completed = false) {
    const element = document.createElement("article");
    element.className = `task-item ${completed ? "completed" : ""}`;
    element.dataset.id = id;
    element.innerHTML = `
      <input type="checkbox" class="checkbox" ${completed ? "checked" : ""} />
      <p class="title">${value}</p>
      <div class="btn-container">
        <button type="button" class="delete-btn">Delete</button>
      </div>`;
    list.appendChild(element);
    container.classList.add("show-container");

    // Add event listener for the checkbox
    const checkbox = element.querySelector(".checkbox");
    checkbox.addEventListener("change", () => {
      element.classList.toggle("completed");
      toggleCompleteInLocalStorage(id);
      displayAlert("Task status updated", "success");
    });
  }

  // Check Task State
  function checkTaskState() {
    if (list.children.length === 0) {
      clearBtn.style.display = "none";
    } else {
      clearBtn.style.display = "block";
    }
  }

  // Setup Tasks from Local Storage
  function setupTasks() {
    const tasks = getLocalStorage();
    tasks.forEach(({ id, value, completed }) =>
      createTaskItem(id, value, completed)
    );
    if (tasks.length) container.classList.add("show-container");
    checkTaskState();
  }

  // Local Storage Functions
  function getLocalStorage() {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
  }

  function addToLocalStorage(id, value) {
    const tasks = getLocalStorage();
    tasks.push({ id, value, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function removeFromLocalStorage(id) {
    const tasks = getLocalStorage().filter((task) => task.id !== id);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function toggleCompleteInLocalStorage(id) {
    const tasks = getLocalStorage().map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function updateLocalStorage(id, value) {
    const tasks = getLocalStorage().map((task) =>
      task.id === id ? { ...task, value } : task
    );
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
})();
