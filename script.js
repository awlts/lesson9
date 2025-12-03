document.addEventListener("DOMContentLoaded", () => {
  setupCalendar();
  setupMemo();
});

/* ========= カレンダー ========= */

function setupCalendar() {
  const root = document.getElementById("calendar-root");
  const today = new Date();
  renderCalendar(root, today);
}

function renderCalendar(root, today) {
  root.innerHTML = "";

  const year = today.getFullYear();
  const month = today.getMonth();

  const header = document.createElement("div");
  header.className = "calendar-header";
  header.innerHTML = `
    <div>${month + 1}月</div>
    <div>${year}</div>
  `;
  root.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);

  for (let i = 0; i < first.getDay(); i++) {
    grid.appendChild(document.createElement("div"));
  }

  for (let d = 1; d <= last.getDate(); d++) {
    const cell = document.createElement("div");
    cell.className = "calendar-day";
    cell.textContent = d;

    if (d === today.getDate()) {
      cell.classList.add("calendar-day--today");
    }

    grid.appendChild(cell);
  }

  root.appendChild(grid);
}

/* ========= メモ ========= */

function setupMemo() {
  const form = document.getElementById("memo-form");
  const input = document.getElementById("memo-input");
  const list = document.getElementById("memo-list");

  const saved = loadMemos();
  saved.forEach((t) => addMemo(list, t));

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    addMemo(list, text);
    saveMemos(list);
    input.value = "";
  });
}

function addMemo(list, text) {
  const li = document.createElement("li");
  li.className = "memo-item";

  const span = document.createElement("span");
  span.textContent = text;

  const del = document.createElement("button");
  del.textContent = "×";
  del.className = "memo-delete";

  del.addEventListener("click", () => {
    list.removeChild(li);
    saveMemos(list);
  });

  li.appendChild(span);
  li.appendChild(del);
  list.appendChild(li);
}

function saveMemos(list) {
  const texts = [...list.querySelectorAll("span")].map((e) => e.textContent);
  localStorage.setItem("memo_data", JSON.stringify(texts));
}

function loadMemos() {
  try {
    return JSON.parse(localStorage.getItem("memo_data")) || [];
  } catch {
    return [];
  }
}
