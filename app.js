// 待辦清單：資料與主題偏好都存在 localStorage
const STORAGE_KEY = "todo-app-items";
const THEME_KEY = "todo-app-theme";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const listEl = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const remainingCount = document.getElementById("remaining-count");
const filterButtons = document.querySelectorAll(".btn-filter");
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
const themeLabel = document.getElementById("theme-label");

// 目前篩選：all | active | completed
let currentFilter = "all";

/** 從 localStorage 讀取待辦，格式錯誤時回傳空陣列 */
function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("讀取待辦資料失敗，改用空清單", error);
    return [];
  }
}

/** 把目前清單寫回 localStorage */
function saveTodos(todos) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getTodos() {
  return loadTodos();
}

/** 套用主題，並更新切換按鈕文字 */
function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const isDark = theme === "dark";
  themeIcon.textContent = isDark ? "☀️" : "🌙";
  themeLabel.textContent = isDark ? "淺色模式" : "深色模式";
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

/** 有手動選擇就用它，否則跟隨系統 prefers-color-scheme */
function initTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);
  if (savedTheme === "light" || savedTheme === "dark") {
    applyTheme(savedTheme);
    return;
  }

  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  applyTheme(prefersDark ? "dark" : "light");
}

function getVisibleTodos(todos) {
  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.done);
  }
  if (currentFilter === "completed") {
    return todos.filter((todo) => todo.done);
  }
  return todos;
}

/** 依篩選結果顯示對應的空狀態文字 */
function getEmptyMessage(todos) {
  if (todos.length === 0) {
    return "還沒有任何待辦事項,新增一個吧!";
  }
  if (currentFilter === "active") {
    return "太棒了,沒有未完成的事項!";
  }
  return "還沒有已完成的事項。";
}

/** 重繪清單；未完成數量永遠看整體，不受篩選影響 */
function render(todos) {
  const visibleTodos = getVisibleTodos(todos);
  listEl.innerHTML = "";
  emptyState.textContent = getEmptyMessage(todos);
  emptyState.classList.toggle("hidden", visibleTodos.length > 0);

  visibleTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item${todo.done ? " done" : ""}`;
    li.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.done;
    checkbox.setAttribute("aria-label", `完成 ${todo.text}`);

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "btn-delete";
    deleteBtn.textContent = "刪除";
    deleteBtn.setAttribute("aria-label", `刪除 ${todo.text}`);

    li.append(checkbox, text, deleteBtn);
    listEl.appendChild(li);
  });

  const remaining = todos.filter((todo) => !todo.done).length;
  remainingCount.textContent = `未完成:${remaining} 項`;
}

function setFilter(filter) {
  currentFilter = filter;
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === filter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
  render(getTodos());
}

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = input.value.trim();

  // 空白內容不新增
  if (!text) {
    return;
  }

  const todos = getTodos();
  todos.push({ id: createId(), text, done: false });
  saveTodos(todos);
  render(todos);
  input.value = "";
  input.focus();
});

listEl.addEventListener("change", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.type !== "checkbox") {
    return;
  }

  const item = target.closest(".todo-item");
  if (!item) {
    return;
  }

  const todos = getTodos().map((todo) =>
    todo.id === item.dataset.id ? { ...todo, done: target.checked } : todo
  );
  saveTodos(todos);
  render(todos);
});

listEl.addEventListener("click", (event) => {
  const target = event.target;
  if (!(target instanceof HTMLElement) || !target.classList.contains("btn-delete")) {
    return;
  }

  const item = target.closest(".todo-item");
  if (!item) {
    return;
  }

  const todos = getTodos().filter((todo) => todo.id !== item.dataset.id);
  saveTodos(todos);
  render(todos);
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

themeToggle.addEventListener("click", () => {
  const nextTheme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
  // 只有使用者手動切換才寫入，之後重新整理會維持這個選擇
  localStorage.setItem(THEME_KEY, nextTheme);
});

initTheme();
render(loadTodos());
