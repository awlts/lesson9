// ページ読み込み時
document.addEventListener("DOMContentLoaded", () => {
  setupCalendar();
  setupMemo();
});

/* ===== カレンダー ===== */

function setupCalendar() {
  const calendarRoot = document.getElementById("calendar-root");
  if (!calendarRoot) return;

  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-11

  renderCalendar(calendarRoot, year, month, today);
}

function renderCalendar(root, year, month, today) {
  root.innerHTML = "";

  const monthName = new Intl.DateTimeFormat("ja-JP", {
    month: "long",
  }).format(new Date(year, month, 1));

  const header = document.createElement("div");
  header.className = "calendar-header";

  const monthSpan = document.createElement("div");
  monthSpan.className = "calendar-month";
  monthSpan.textContent = monthName;

  const yearSpan = document.createElement("div");
  yearSpan.className = "calendar-year";
  yearSpan.textContent = String(year);

  header.appendChild(monthSpan);
  header.appendChild(yearSpan);
  root.appendChild(header);

  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  weekdays.forEach((w) => {
    const wd = document.createElement("div");
    wd.className = "calendar-weekday";
    wd.textContent = w;
    grid.appendChild(wd);
  });

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startWeekday = firstDay.getDay();
  const daysInMonth = lastDay.getDate();

  for (let i = 0; i < startWeekday; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day calendar-day--empty";
    grid.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateCell = document.createElement("div");
    dateCell.className = "calendar-day calendar-day--in-month";

    const dateObj = new Date(year, month, day);
    const weekday = dateObj.getDay();

    if (weekday === 0) dateCell.classList.add("calendar-day--sun");
    if (weekday === 6) dateCell.classList.add("calendar-day--sat");

    if (
      dateObj.getFullYear() === today.getFullYear() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getDate() === today.getDate()
    ) {
      dateCell.classList.add("calendar-day--today");
    }

    dateCell.textContent = String(day);
    grid.appendChild(dateCell);
  }

  root.appendChild(grid);
}

/* ===== メモ ===== */

function setupMemo() {
  const form = document.getElementById("memo-form");
  const input = document.getElementById("memo-input");
  const list = document.getElementById("memo-list");

  if (!form || !input || !list) return;

  // ローカルストレージから復元
  const saved = loadMemos();
  saved.forEach((text) => {
    appendMemoItem(list, text);
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendMemoItem(list, text);
    saveMemos(list);
    input.value = "";
  });
}

function appendMemoItem(list, text) {
  const li = document.createElement("li");
  li.className = "memo-item";

  const span = document.createElement("span");
  span.className = "memo-text";
  span.textContent = text;

  const delBtn = document.createElement("button");
  delBtn.className = "memo-delete";
  delBtn.type = "button";
  delBtn.textContent = "×";

  delBtn.addEventListener("click", () => {
    list.removeChild(li);
    saveMemos(list);
  });

  li.appendChild(span);
  li.appendChild(delBtn);
  list.appendChild(li);
}

function saveMemos(list) {
  const items = [...list.querySelectorAll(".memo-text")].map(
    (el) => el.textContent ?? ""
  );
  localStorage.setItem("simple_memo_list", JSON.stringify(items));
}

function loadMemos() {
  try {
    const raw = localStorage.getItem("simple_memo_list");
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch {
    return [];
  }
}
