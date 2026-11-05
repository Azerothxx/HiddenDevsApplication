// ===== GLOBAL STATE =====
let tasks = [];
let selectedTaskId = null;
const STORAGE_KEY = "kanban_tasks";

// ===== INITIALIZATION =====
document.addEventListener("DOMContentLoaded", init);

function init() {
    loadTasks();
    renderTasks();
    attachEventListeners();
}

// ===== STATE MANAGEMENT =====
function loadTasks() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            tasks = JSON.parse(stored);
            // Sort by order within each list
            tasks.sort((a, b) => {
                if (a.listId === b.listId) return a.order - b.order;
                return 0;
            });
        }
    } catch (error) {
        console.error("Failed to load tasks:", error);
        tasks = [];
    }
}

function saveTasks() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
        console.error("Failed to save tasks:", error);
        alert("Failed to save tasks. Storage may be full.");
    }
}

// ===== CRUD OPERATIONS =====
function addTask(title, category, listId) {
    const task = {
        id: generateTaskId(),
        title: title,
        category: category || "",
        listId: listId,
        createdAt: Date.now(),
        order: tasks.filter((t) => t.listId === listId).length,
    };

    tasks.push(task);
    saveTasks();
    renderTasks();
}

function updateTask(id, updates) {
    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex !== -1) {
        tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
        saveTasks();
        renderTasks();
    }
}

function deleteTask(id) {
    tasks = tasks.filter((t) => t.id !== id);

    // If deleted task was selected, deselect
    if (selectedTaskId === id) {
        selectedTaskId = null;
    }

    saveTasks();
    renderTasks();
}

function getTaskById(id) {
    return tasks.find((t) => t.id === id);
}

// ===== SELECTION MANAGEMENT =====
function selectTask(id) {
    // Toggle selection: if clicking same card, deselect
    if (selectedTaskId === id) {
        deselectTask();
        return;
    }

    // Remove previous selection
    deselectTask();

    // Set new selection
    selectedTaskId = id;

    // Update visual state
    const cardElement = document.querySelector(`[data-task-id="${id}"]`);
    if (cardElement) {
        cardElement.classList.add("selected");
    }
}

function deselectTask() {
    selectedTaskId = null;

    // Remove selected class from all cards
    const allCards = document.querySelectorAll(".card");
    allCards.forEach((card) => card.classList.remove("selected"));
}

function getSelectedTask() {
    if (!selectedTaskId) return null;
    return getTaskById(selectedTaskId);
}

// ===== RENDERING =====
function renderTasks() {
    // Clear all lists (except h2 headers)
    const lists = document.querySelectorAll(".list");
    lists.forEach((list) => {
        const header = list.querySelector("h2");
        list.innerHTML = "";
        if (header) {
            list.appendChild(header);
        }
    });

    // Render all tasks
    tasks.forEach((task) => {
        const cardElement = createCardElement(task);
        const listElement = document.getElementById(task.listId);
        listElement.appendChild(cardElement);
    });

    // Re-attach drag listeners
    attachDragListeners();

    // Restore selection if exists
    if (selectedTaskId) {
        const cardElement = document.querySelector(
            `[data-task-id="${selectedTaskId}"]`,
        );
        if (cardElement) {
            cardElement.classList.add("selected");
        }
    }
}

function createCardElement(task) {
    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.dataset.taskId = task.id;

    // Create card content container
    const cardContent = document.createElement("div");
    cardContent.className = "card-content";

    // Create title
    const cardTitle = document.createElement("div");
    cardTitle.className = "card-title";
    cardTitle.textContent = task.title;
    cardContent.appendChild(cardTitle);

    // Create category if exists
    if (task.category) {
        const cardCategory = document.createElement("p");
        cardCategory.className = "card-category";
        cardCategory.textContent = task.category;
        cardContent.appendChild(cardCategory);
    }

    card.appendChild(cardContent);

    // Attach click listener for selection
    card.addEventListener("click", (e) => {
        e.stopPropagation();
        selectTask(task.id);
    });

    return card;
}

// ===== MODAL MANAGEMENT =====
let currentModalMode = "create";
let currentEditingTaskId = null;

function openModal(mode = "create", taskId = null) {
    currentModalMode = mode;
    currentEditingTaskId = taskId;

    const modal = document.getElementById("task-modal");
    const modalTitle = document.getElementById("modal-title");
    const form = document.getElementById("task-form");

    // Set modal title
    modalTitle.textContent = mode === "create" ? "Create Task" : "Edit Task";

    // Reset form
    form.reset();

    // If edit mode, pre-fill form
    if (mode === "edit" && taskId) {
        const task = getTaskById(taskId);
        if (task) {
            document.getElementById("task-title-input").value = task.title;
            document.getElementById("task-category-input").value =
                task.category;
            document.getElementById("task-list-select").value = task.listId;
        }
    }

    // Show modal
    modal.classList.remove("hidden");

    // Focus on first input
    document.getElementById("task-title-input").focus();
}

function closeModal() {
    const modal = document.getElementById("task-modal");
    modal.classList.add("hidden");

    // Reset form
    document.getElementById("task-form").reset();

    currentModalMode = "create";
    currentEditingTaskId = null;
}

function handleFormSubmit(e) {
    e.preventDefault();

    // Get form values
    const title = document.getElementById("task-title-input").value.trim();
    const category = document
        .getElementById("task-category-input")
        .value.trim();
    const listId = document.getElementById("task-list-select").value;

    // Validate
    if (!title) {
        alert("Task name is required");
        return;
    }

    // Create or update
    if (currentModalMode === "create") {
        addTask(title, category, listId);
    } else if (currentModalMode === "edit" && currentEditingTaskId) {
        updateTask(currentEditingTaskId, { title, category, listId });
    }

    // Close modal
    closeModal();
}

// ===== DRAG AND DROP =====
function dragStart(e) {
    e.dataTransfer.setData("text/plain", this.dataset.taskId);
}

function dragEnd() {
    // Deselect after drag
    deselectTask();
}

function dragOver(e) {
    e.preventDefault();
}

function dragEnter(e) {
    e.preventDefault();
    this.classList.add("over");
}

function dragLeave(e) {
    this.classList.remove("over");
}

function dragDrop(e) {
    const taskId = e.dataTransfer.getData("text/plain");
    const card = document.querySelector(`[data-task-id="${taskId}"]`);

    // Update DOM
    this.appendChild(card);
    this.classList.remove("over");

    // Update state
    const task = getTaskById(taskId);
    if (task) {
        task.listId = this.id;

        // Recalculate order
        updateTaskOrders(this.id);

        saveTasks();
    }
}

function updateTaskOrders(listId) {
    // Get all cards in the specified list
    const listElement = document.getElementById(listId);
    const cards = listElement.querySelectorAll(".card");

    cards.forEach((card, index) => {
        const taskId = card.dataset.taskId;
        const task = getTaskById(taskId);
        if (task) {
            task.order = index;
        }
    });
}

// ===== SEARCH/FILTER =====
function filterTasks(searchTerm) {
    const term = searchTerm.toLowerCase().trim();
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {
        const taskId = card.dataset.taskId;
        const task = getTaskById(taskId);

        if (task) {
            const titleMatch = task.title.toLowerCase().includes(term);
            const categoryMatch = task.category.toLowerCase().includes(term);

            if (term === "" || titleMatch || categoryMatch) {
                card.style.display = "";
            } else {
                card.style.display = "none";
            }
        }
    });

    // Toggle clear button visibility
    const clearButton = document.getElementById("clear-search");
    if (clearButton) {
        if (term === "") {
            clearButton.classList.add("hidden");
        } else {
            clearButton.classList.remove("hidden");
        }
    }
}

function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// ===== EVENT LISTENERS =====
function attachEventListeners() {
    // Modify button
    const createBtn = document.getElementById("create-btn");
    const deleteBtn = document.getElementById("delete-btn");
    const modifyBtn = document.getElementById("modify-btn");

    // Modal
    const taskForm = document.getElementById("task-form");
    const cancelBtn = document.getElementById("cancel-btn");
    const modalOverlay = document.querySelector(".modal-overlay");

    // Search input
    const searchInput = document.getElementById("search-input");
    const clearSearchBtn = document.getElementById("clear-search");

    createBtn.addEventListener("click", () => {
        openModal("create");
    });
    deleteBtn.addEventListener("click", () => {
        const selectedTask = getSelectedTask();
        if (!selectedTask) {
            alert("Please select a task to delete");
            return;
        }

        if (confirm(`Delete "${selectedTask.title}"?`)) {
            deleteTask(selectedTask.id);
        }
    });

    modifyBtn.addEventListener("click", () => {
        const selectedTask = getSelectedTask();
        if (!selectedTask) {
            alert("Please select a task to modify");
            return;
        }

        openModal("edit", selectedTask.id);
    });

    taskForm.addEventListener("submit", handleFormSubmit);
    cancelBtn.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", closeModal);

    // ESC key - close modal or deselect
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            const modal = document.getElementById("task-modal");
            if (modal && !modal.classList.contains("hidden")) {
                closeModal();
            } else {
                deselectTask();
            }
        }
    });

    searchInput.addEventListener(
        "input",
        debounce((e) => {
            filterTasks(e.target.value);
        }, 300),
    );

    clearSearchBtn.addEventListener("click", () => {
        searchInput.value = "";
        filterTasks("");
    });

    // Document click - deselect if clicking outside cards
    document.addEventListener("click", (e) => {
        if (!e.target.closest(".card") && !e.target.closest(".modal-content")) {
            deselectTask();
        }
    });
}

function attachDragListeners() {
    const cards = document.querySelectorAll(".card");
    const lists = document.querySelectorAll(".list");

    cards.forEach((card) => {
        card.addEventListener("dragstart", dragStart);
        card.addEventListener("dragend", dragEnd);
    });

    lists.forEach((list) => {
        list.addEventListener("dragover", dragOver);
        list.addEventListener("dragenter", dragEnter);
        list.addEventListener("dragleave", dragLeave);
        list.addEventListener("drop", dragDrop);
    });
}

// ===== UTILITIES =====
function generateTaskId() {
    return (
        "task_" + Date.now() + "_" + Math.random().toString(36).substring(2, 9)
    );
}
