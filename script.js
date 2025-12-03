// script.js

// ページ読み込み完了時に実行
document.addEventListener("DOMContentLoaded", () => {
  const calendarRoot = document.getElementById("calendar-root");
  if (!calendarRoot) return;

  // 今日の日付を取得
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-11（0:1月）

  renderCalendar(calendarRoot, year, month, today);
});

/**
 * カレンダーを描画する
 * @param {HTMLElement} root カレンダーを描画するルート要素
 * @param {number} year 年（例: 2025）
 * @param {number} month 月（0-11）
 * @param {Date} today 今日の日付オブジェクト
 */
function renderCalendar(root, year, month, today) {
  // 既存の中身をクリア
  root.innerHTML = "";

  // 月名をロケールに合わせて取得（例: "2025年12月" の「12月」部分）
  const monthName = new Intl.DateTimeFormat("ja-JP", {
    month: "long",
  }).format(new Date(year, month, 1));

  // カレンダーのヘッダー
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

  // カレンダーのグリッド
  const grid = document.createElement("div");
  grid.className = "calendar-grid";

  // 曜日ラベル
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  weekdays.forEach((w) => {
    const wd = document.createElement("div");
    wd.className = "calendar-weekday";
    wd.textContent = w;
    grid.appendChild(wd);
  });

  // その月の情報を計算
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0); // 次の月の0日目 = 当月末日
  const startWeekday = firstDay.getDay(); // 0:日曜〜6:土曜
  const daysInMonth = lastDay.getDate();

  // 1日の前に必要な空白セル
  for (let i = 0; i < startWeekday; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day calendar-day--empty";
    grid.appendChild(emptyCell);
  }

  // 日付セルを追加
  for (let day = 1; day <= daysInMonth; day++) {
    const dateCell = document.createElement("div");
    dateCell.className = "calendar-day calendar-day--in-month";

    const dateObj = new Date(year, month, day);
    const weekday = dateObj.getDay();

    // 土日で色分け
    if (weekday === 0) {
      dateCell.classList.add("calendar-day--sun");
    } else if (weekday === 6) {
      dateCell.classList.add("calendar-day--sat");
    }

    // 今日ならハイライト
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
