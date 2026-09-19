// 待辦清單：用 localStorage 保存，重新整理後資料仍在
const STORAGE_KEY = "todo-app-items";

const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const listEl = document.getElementById("todo-list");
const emptyState = document.getElementById("empty-state");
const remainingCount = document.getElementById("remaining-count");

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

/** 依資料重繪清單、空狀態與未完成數量 */
function render(todos) {
  listEl.innerHTML = "";
  emptyState.classList.toggle("hidden", todos.length > 0);

  todos.forEach((todo) => {
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

function getTodos() {
  return loadTodos();
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

// 進頁面時先還原已儲存的資料
render(loadTodos());
