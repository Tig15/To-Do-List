// Variables
var tasks = [];

// DOM Ready
$(function () {
  // Load Tasks
  loadTasks();

  // Add Task Form Submit
  $("#add-task-form").submit(function (event) {
    event.preventDefault();
    addTask();
  });

  // Mark Task as Completed
  $(document).on("click", ".mark-as-completed-btn", function () {
    var index = $(this).data("index");
    markTaskAsCompleted(index);
  });

  // Delete Task
  $(document).on("click", ".delete-task-btn", function () {
    var index = $(this).data("index");
    deleteTask(index);
  });

  // Search Tasks
  $("#search-tasks-input").on("input", function () {
    var searchTerm = $(this).val();
    searchTasks(searchTerm);
  });

  // Filter Tasks by Priority
  $("#filter-tasks-select").on("change", function () {
    var priority = $(this).val();
    filterTasksByPriority(priority);
  });

  // Sort Tasks by Due Date or Priority
  $("#sort-tasks-select").on("change", function () {
    var sortType = $(this).val();
    sortTasks(sortType);
  });
});

// Load Tasks
function loadTasks() {
  // TODO: Load tasks from storage or server
  // For now, add some sample tasks
  addTaskToList("Buy groceries", "Milk, bread, eggs", "2023-04-30", "high");
  addTaskToList(
    "Clean house",
    "Vacuum, dust, wash dishes",
    "2023-05-01",
    "medium"
  );
  addTaskToList(
    "Study for exam",
    "Review notes, practice problems",
    "2023-05-05",
    "high"
  );
}

// Add Task
function addTask() {
  // Get form values
  var title = $("#title").val();
  var description = $("#description").val();
  var dueDate = $("#due-date").val();
  var priority = $("#priority").val();

  // Add task to list
  addTaskToList(title, description, dueDate, priority);

  // Clear form
  $("#title").val("");
  $("#description").val("");
  $("#due-date").val("");
  $("#priority").val("");
}

// Add Task to List
function addTaskToList(title, description, dueDate, priority) {
  // Create task object
  var task = {
    title: title,
    description: description,
    dueDate: dueDate,
    priority: priority,
    completed: false,
  };
  // Add task to tasks array
  tasks.push(task);

  // Update task list display
  displayTasks();
}

// Delete Task
function deleteTask(index) {
  // Remove task from tasks array
  tasks.splice(index, 1);
  // Update task list display
  displayTasks();
}

// Mark Task as Completed
function markTaskAsCompleted(index) {
  // Update completed status of task
  tasks[index].completed = true;
  displayTasks();
}

// Search Tasks
function searchTasks(searchTerm) {
  // Filter tasks by title or description containing search term
  var filteredTasks = tasks.filter(function (task) {
    var titleMatch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    var descriptionMatch = task.description
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return titleMatch || descriptionMatch;
  });
  // Update task list display with filtered tasks
  displayTasks(filteredTasks);
}

// Filter Tasks by Priority
function filterTasksByPriority(priority) {
  // Filter tasks by priority
  var filteredTasks = tasks.filter(function (task) {
    return task.priority === priority;
  });
  // Update task list display with filtered tasks
  displayTasks(filteredTasks);
}

// Sort Tasks by Due Date or Priority
function sortTasks(sortType) {
  // Sort tasks by due date or priority
  if (sortType === "due-date") {
    tasks.sort(function (a, b) {
      var aDueDate = new Date(a.dueDate);
      var bDueDate = new Date(b.dueDate);
      return aDueDate - bDueDate;
    });
  } else if (sortType === "priority") {
    tasks.sort(function (a, b) {
      var aPriority =
        a.priority === "high" ? 3 : a.priority === "medium" ? 2 : 1;
      var bPriority =
        b.priority === "high" ? 3 : b.priority === "medium" ? 2 : 1;
      return bPriority - aPriority;
    });
  }
  // Update task list display
  displayTasks();
}

// Display Tasks
function displayTasks(filteredTasks) {
  // Clear task list
  $("#task-list").empty();
  // Use filtered tasks or all tasks if no filter specified
  var displayTasks = filteredTasks || tasks;

  // Add each task to task list
  displayTasks.forEach(function (task, index) {
    var taskElement = $("<div>").addClass("task");

    if (task.completed) {
      taskElement.addClass("completed");
    }

    var titleElement = $("<div>").addClass("title").text(task.title);
    taskElement.append(titleElement);

    if (task.description) {
      var descriptionElement = $("<div>")
        .addClass("description")
        .text(task.description);
      taskElement.append(descriptionElement);
    }

    if (task.dueDate) {
      var dueDateElement = $("<div>")
        .addClass("due-date")
        .text("Due: " + task.dueDate);
      taskElement.append(dueDateElement);
    }

    var priorityButtonGroup = $("<div>").addClass("btn-group");

    var lowPriorityButton = $("<button>")
      .addClass("btn btn-default btn-priority-low")
      .text("Low");
    if (task.priority === "low") {
      lowPriorityButton.addClass("active");
    }
    priorityButtonGroup.append(lowPriorityButton);

    var mediumPriorityButton = $("<button>")
      .addClass("btn btn-default btn-priority-medium")
      .text("Medium");
    if (task.priority === "medium") {
      mediumPriorityButton.addClass("active");
    }
    priorityButtonGroup.append(mediumPriorityButton);
    var highPriorityButton = $("<button>")
      .addClass("btn btn-default btn-priority-high")
      .text("High");
    if (task.priority === "high") {
      highPriorityButton.addClass("active");
    }
    priorityButtonGroup.append(highPriorityButton);

    taskElement.append(priorityButtonGroup);

    var actionButtonGroup = $("<div>").addClass("btn-group");

    var completeButton = $("<button>")
      .addClass("btn btn-success btn-complete")
      .text("Complete");
    if (task.completed) {
      completeButton.prop("disabled", true);
    }
    actionButtonGroup.append(completeButton);

    var deleteButton = $("<button>")
      .addClass("btn btn-danger btn-delete")
      .text("Delete");
    actionButtonGroup.append(deleteButton);

    taskElement.append(actionButtonGroup);

    // Add click handlers for task actions
    lowPriorityButton.click(function () {
      changePriority(index, "low");
    });
    mediumPriorityButton.click(function () {
      changePriority(index, "medium");
    });
    highPriorityButton.click(function () {
      changePriority(index, "high");
    });
    completeButton.click(function () {
      markTaskAsCompleted(index);
    });
    deleteButton.click(function () {
      deleteTask(index);
    });

    $("#task-list").append(taskElement);
  });
}

// Change Task Priority
function changePriority(index, newPriority) {
  // Update priority of task
  tasks[index].priority = newPriority;
  displayTasks();
}

// Initialize Task List
function initTaskList() {
  // Add click handler for add task button
  $("#btn-add-task").click(function () {
    var title = $("#input-task-title").val();
    var description = $("#input-task-description").val();
    var dueDate = $("#input-task-due-date").val();
    var priority = $("input[name='priority']:checked").val();
    addTask(title, description, dueDate, priority);
  });
  // Add keyup handler for search box
  $("#input-search").on("keyup", function () {
    var searchTerm = $(this).val();
    searchTasks(searchTerm);
  });

  // Add click handlers for priority filters
  $("#btn-filter-priority-all").click(function () {
    displayTasks();
  });
  $("#btn-filter-priority-low").click(function () {
    filterTasksByPriority("low");
  });
  $("#btn-filter-priority-medium").click(function () {
    filterTasksByPriority("medium");
  });
  $("#btn-filter-priority-high").click(function () {
    filterTasksByPriority("high");
  });

  // Add click handlers for sort buttons
  $("#btn-sort-due-date").click(function () {
    sortTasks("due-date");
  });
  $("#btn-sort-priority").click(function () {
    sortTasks("priority");
  });

  // Display task list
  displayTasks();
}

// Initialize app on document ready
$(document).ready(function () {
  initTaskList();
});
