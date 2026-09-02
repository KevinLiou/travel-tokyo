import { tripData } from "./data/trip-data.js";

const app = document.querySelector("#app");
const checklistStorageKey = "tokyo-trip-checklist";
const checklistGroupIds = new Set(tripData.checklistGroups.map((group) => group.id));
const storedChecklist = loadChecklistState();
const state = {
  checklist: storedChecklist.items,
  customItems: storedChecklist.customItems,
  checklistFilter: "all",
  activePlans: {}
};
let searchTimer;

function escapeHTML(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function externalLink(url, label, className = "map-link") {
  return `<a class="${className}" href="${escapeHTML(url)}" target="_blank" rel="noreferrer"><span>${escapeHTML(label)}</span></a>`;
}

function parseRoute() {
  const hash = window.location.hash.replace(/^#\/?/, "");
  const [path, queryString = ""] = hash.split("?");
  const segments = path.split("/").filter(Boolean);
  const route = segments[0] || "day";
  return {
    route,
    id: segments[1] || "d1",
    query: new URLSearchParams(queryString)
  };
}

function dayForId(id) {
  return tripData.days.find((day) => day.id === id) || tripData.days[0];
}

function defaultChecklist() {
  return Object.fromEntries(tripData.checklist.map((item) => [item.id, item.done]));
}

function normalizeCustomItem(item) {
  if (!item || typeof item !== "object") return null;
  const id = String(item.id || "").trim();
  const group = String(item.group || "").trim();
  const label = String(item.label || "").trim().slice(0, 80);
  const description = String(item.description || "").trim().slice(0, 160);
  if (!id || !id.startsWith("custom-") || !checklistGroupIds.has(group) || !label) return null;
  if (tripData.checklist.some((builtInItem) => builtInItem.id === id)) return null;
  return { id, group, dayId: null, label, description };
}

function loadChecklistState() {
  const defaults = defaultChecklist();
  const customItems = [];
  if (typeof localStorage === "undefined") return { items: defaults, customItems };

  try {
    const stored = JSON.parse(localStorage.getItem(checklistStorageKey) || "null");
    if (!stored || typeof stored.items !== "object") return { items: defaults, customItems };
    for (const item of tripData.checklist) {
      if (typeof stored.items[item.id] === "boolean") defaults[item.id] = stored.items[item.id];
    }
    if (Array.isArray(stored.customItems)) {
      for (const rawItem of stored.customItems) {
        const item = normalizeCustomItem(rawItem);
        if (!item || customItems.some((existing) => existing.id === item.id)) continue;
        customItems.push(item);
        defaults[item.id] = stored.items[item.id] === true;
      }
    }
  } catch {
    return { items: defaults, customItems };
  }
  return { items: defaults, customItems };
}

function saveChecklistState() {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(checklistStorageKey, JSON.stringify({
      version: tripData.version,
      items: state.checklist,
      customItems: state.customItems
    }));
  } catch {
    // Private browsing or a full storage quota should not block checklist use.
  }
}

function allChecklistItems() {
  return [...tripData.checklist, ...state.customItems];
}

function isCustomChecklistItem(item) {
  return state.customItems.some((customItem) => customItem.id === item.id);
}

function createCustomItemId() {
  const uuid = globalThis.crypto?.randomUUID?.();
  return `custom-${uuid || `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`}`;
}

function japanDateTime(date = new Date()) {
  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(date);
}

function japanDateKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function tripDate(day, time) {
  return new Date(`${day.isoDate}T${time}:00+09:00`);
}

function getTripStatus(now = new Date()) {
  const firstDay = tripData.days[0];
  const lastDay = tripData.days.at(-1);
  const tripStart = tripDate(firstDay, "00:00");
  const tripEnd = tripDate(lastDay, lastDay.timeline.at(-1).end);
  const nextNode = tripData.days.flatMap((day) => day.timeline.map((item) => ({ day, node: item })))
    .find(({ day, node }) => tripDate(day, node.start) > now);

  if (now < tripStart) {
    return {
      phase: "before",
      label: "出發倒數",
      detail: `${Math.ceil((tripStart - now) / 86400000)} 天後開始`,
      current: null,
      next: nextNode,
      nowLabel: japanDateTime(now)
    };
  }

  if (now > tripEnd) {
    return {
      phase: "after",
      label: "旅程已完成",
      detail: "五日行程已走完",
      current: null,
      next: null,
      nowLabel: japanDateTime(now)
    };
  }

  for (const day of tripData.days) {
    for (const item of day.timeline) {
      if (now >= tripDate(day, item.start) && now < tripDate(day, item.end)) {
        const later = day.timeline.find((candidate) => tripDate(day, candidate.start) > now);
        const laterNode = later ? { day, node: later } : tripData.days
          .flatMap((candidateDay) => candidateDay.timeline.map((candidate) => ({ day: candidateDay, node: candidate })))
          .find(({ day: candidateDay, node: candidate }) => tripDate(candidateDay, candidate.start) > now);
        return {
          phase: "during",
          label: "旅程進行中",
          detail: japanDateTime(now),
          current: { day, node: item },
          next: laterNode || null,
          nowLabel: japanDateTime(now)
        };
      }
    }
  }

  return {
    phase: "transfer",
    label: "轉場時間",
    detail: japanDateTime(now),
    current: null,
    next: nextNode,
    nowLabel: japanDateTime(now)
  };
}

function nodeState(day, item, tripStatus) {
  if (tripStatus.current?.day.id === day.id && tripStatus.current.node.id === item.id) return "current";
  if (tripStatus.next?.day.id === day.id && tripStatus.next.node.id === item.id) return "next";
  return "future";
}

function statusTone(status) {
  if (/預約|安排|排定/.test(status)) return "booked";
  if (/待確認|提醒|出發前/.test(status)) return "alert";
  if (/採買|Walk-in|現場/.test(status)) return "open";
  return "neutral";
}

function renderTripStatus(tripStatus) {
  const current = tripStatus.current
    ? `${tripStatus.current.day.shortDay} · ${tripStatus.current.node.title}`
    : tripStatus.phase === "after" ? "可以回看任一天" : "旅程尚未開始";
  const next = tripStatus.next
    ? `${tripStatus.next.day.shortDay} · ${tripStatus.next.node.title}`
    : "沒有下一個排定節點";

  return `
    <aside class="trip-status" aria-label="日本時間行程狀態">
      <div class="trip-status__top">
        <span class="status-mark status-mark--${escapeHTML(tripStatus.phase)}" aria-hidden="true"></span>
        <span>${escapeHTML(tripStatus.label)}</span>
      </div>
      <strong>${escapeHTML(tripStatus.detail)}</strong>
      <dl class="trip-status__list">
        <div><dt>現在</dt><dd>${escapeHTML(current)}</dd></div>
        <div><dt>下一站</dt><dd>${escapeHTML(next)}</dd></div>
      </dl>
      <p class="trip-status__clock">日本時間 ${escapeHTML(tripStatus.nowLabel)}</p>
    </aside>`;
}

function renderDayTab(day, activeDayId) {
  const selected = day.id === activeDayId;
  return `
    <a class="day-tab${selected ? " is-selected" : ""}" href="#/day/${escapeHTML(day.id)}" role="tab" aria-selected="${selected}">
      <span>${escapeHTML(day.shortDay)}</span>
      <time datetime="${escapeHTML(day.isoDate)}">${escapeHTML(day.date.slice(0, 4))}</time>
    </a>`;
}

function renderPlanSwitch(day, activePlanId) {
  const alternative = tripData.alternatives.find((item) => item.dayId === day.id);
  if (!alternative) return "";
  const planBSelected = activePlanId === alternative.id;
  return `
    <div class="plan-switch" aria-label="D2 行程方案">
      <span class="plan-switch__label">天氣機動</span>
      <div class="plan-switch__options">
        <button class="plan-switch__button${!planBSelected ? " is-selected" : ""}" type="button" data-plan="${escapeHTML(day.id)}" data-plan-id="main" aria-pressed="${!planBSelected}">河口湖正選</button>
        <button class="plan-switch__button${planBSelected ? " is-selected" : ""}" type="button" data-plan="${escapeHTML(day.id)}" data-plan-id="${escapeHTML(alternative.id)}" aria-pressed="${planBSelected}">Plan B</button>
      </div>
    </div>`;
}

function renderTimelineNode(day, item, tripStatus, planId = "main") {
  const stateName = nodeState(day, item, tripStatus);
  const itemId = `node-${day.id}-${planId}-${item.id}`;
  const sourceLink = item.sourceUrl ? externalLink(item.sourceUrl, "官方資訊", "map-link map-link--secondary") : "";
  return `
    <li class="timeline-item timeline-item--${stateName}" id="${escapeHTML(itemId)}">
      <div class="timeline-time"><time datetime="${escapeHTML(`${day.isoDate}T${item.start}:00+09:00`)}">${escapeHTML(item.time)}</time></div>
      <div class="timeline-marker" aria-hidden="true"><span></span></div>
      <article class="timeline-card">
        <div class="timeline-card__top">
          <div>
            <p class="timeline-card__index">${escapeHTML(day.shortDay)} / ${escapeHTML(item.start)}</p>
            <h3>${escapeHTML(item.title)}</h3>
          </div>
          <span class="status-badge status-badge--${escapeHTML(statusTone(item.status))}">${escapeHTML(item.status)}</span>
        </div>
        <p class="timeline-card__location"><span aria-hidden="true">⌖</span>${escapeHTML(item.location)}</p>
        <dl class="timeline-card__details">
          <div><dt>交通</dt><dd>${escapeHTML(item.transport)}</dd></div>
          <div><dt>備註</dt><dd>${escapeHTML(item.note)}</dd></div>
        </dl>
        <div class="timeline-card__actions">
          ${externalLink(item.mapUrl, "開啟地圖")}
          ${sourceLink}
        </div>
      </article>
    </li>`;
}

function renderDayBoard(day, activePlanId, tripStatus) {
  const alternative = tripData.alternatives.find((item) => item.dayId === day.id);
  const showingPlanB = alternative && activePlanId === alternative.id;
  const timeline = showingPlanB ? alternative.timeline : day.timeline;
  const planId = showingPlanB ? alternative.id : "main";
  const title = showingPlanB ? alternative.title : day.title;
  const summary = showingPlanB ? alternative.summary : day.summary;

  return `
    <section class="day-board" id="timeline" aria-labelledby="day-board-title">
      <header class="day-board__head">
        <div>
          <div class="day-board__date"><span>${escapeHTML(day.day)}</span><time datetime="${escapeHTML(day.isoDate)}">${escapeHTML(day.date)}</time></div>
          <h2 id="day-board-title">${escapeHTML(title)}</h2>
          <p class="day-board__route">${escapeHTML(day.route)}</p>
        </div>
        <div class="day-board__side">
          <p>${escapeHTML(showingPlanB ? "備案動線" : "今日摘要")}</p>
          <strong>${escapeHTML(showingPlanB ? "天氣或交通不適合時切換" : day.priority)}</strong>
        </div>
      </header>
      <div class="day-board__summary">
        <p>${escapeHTML(summary)}</p>
        <p class="day-board__food">${escapeHTML(day.food)}</p>
      </div>
      ${renderPlanSwitch(day, activePlanId)}
      <ol class="timeline" aria-label="${escapeHTML(day.shortDay)} 時間軸">
        ${timeline.map((item) => renderTimelineNode(day, item, tripStatus, planId)).join("")}
      </ol>
    </section>`;
}

function renderDayPager(day) {
  const index = tripData.days.findIndex((item) => item.id === day.id);
  const previous = tripData.days[index - 1];
  const next = tripData.days[index + 1];
  return `
    <nav class="day-pager" aria-label="前後日期">
      ${previous ? `<a class="day-pager__link" href="#/day/${escapeHTML(previous.id)}"><span>上一日</span><strong>${escapeHTML(previous.shortDay)} · ${escapeHTML(previous.title)}</strong></a>` : "<span class=\"day-pager__empty\"></span>"}
      ${next ? `<a class="day-pager__link day-pager__link--next" href="#/day/${escapeHTML(next.id)}"><span>下一日</span><strong>${escapeHTML(next.shortDay)} · ${escapeHTML(next.title)}</strong></a>` : "<span class=\"day-pager__empty\"></span>"}
    </nav>`;
}

function renderItinerary(day, route) {
  const tripStatus = getTripStatus();
  const alternative = tripData.alternatives.find((item) => item.dayId === day.id);
  if (route.query.has("plan") && alternative) state.activePlans[day.id] = route.query.get("plan");
  const activePlanId = state.activePlans[day.id] || "main";

  app.innerHTML = `
    <div class="page-intro page-intro--board">
      <div>
        <p class="eyebrow">${escapeHTML(tripData.meta.dateLabel)} · ${escapeHTML(tripData.meta.travelerLabel)}</p>
        <h1>${escapeHTML(tripData.meta.shortTitle)}</h1>
        <p class="page-intro__lede">選一天，沿著時間軸走。每個節點都把地點、交通、備註與要不要預約放在一起。</p>
      </div>
      ${renderTripStatus(tripStatus)}
    </div>
    <section class="day-picker" aria-labelledby="day-picker-title">
      <div class="section-line">
        <div><p class="section-label">01 / 日程</p><h2 id="day-picker-title">先選今天要看的日子</h2></div>
        <span class="section-note">可手動切換，不受自動定位限制</span>
      </div>
      <div class="day-tabs" role="tablist" aria-label="五日日期選擇">${tripData.days.map((item) => renderDayTab(item, day.id)).join("")}</div>
    </section>
    ${renderDayBoard(day, activePlanId, tripStatus)}
    <section class="board-notes" aria-labelledby="board-notes-title">
      <div class="section-line"><div><p class="section-label">02 / 讀法</p><h2 id="board-notes-title">行程上的小規則</h2></div></div>
      <div class="note-list">${day.highlights.map((highlight, index) => `<p><span>0${index + 1}</span>${escapeHTML(highlight)}</p>`).join("")}</div>
    </section>
    ${renderDayPager(day)}`;

  focusTarget(route.query.get("focus"));
}

function checklistStats() {
  const items = allChecklistItems();
  const total = items.length;
  const completed = items.filter((item) => state.checklist[item.id]).length;
  return { total, completed, remaining: total - completed };
}

function renderChecklistItem(item) {
  const checked = Boolean(state.checklist[item.id]);
  const isCustom = isCustomChecklistItem(item);
  return `
    <li class="check-row${checked ? " is-complete" : ""}" id="check-${escapeHTML(item.id)}">
      <label class="check-row__label">
        <input type="checkbox" data-check-id="${escapeHTML(item.id)}" ${checked ? "checked" : ""} aria-describedby="check-desc-${escapeHTML(item.id)}" />
        <span class="check-row__box" aria-hidden="true"></span>
        <span class="check-row__copy"><strong>${escapeHTML(item.label)}${isCustom ? " <em>自訂</em>" : ""}</strong><span id="check-desc-${escapeHTML(item.id)}">${escapeHTML(item.description || "自訂項目")}</span></span>
      </label>
      <div class="check-row__actions">
        ${item.dayId ? `<a class="check-row__day" href="#/day/${escapeHTML(item.dayId)}">${escapeHTML(dayForId(item.dayId).shortDay)} <span aria-hidden="true">↗</span></a>` : ""}
        ${isCustom ? `<button class="check-row__delete" type="button" data-delete-check-id="${escapeHTML(item.id)}">刪除</button>` : ""}
      </div>
    </li>`;
}

function renderChecklistGroup(group) {
  const items = allChecklistItems().filter((item) => item.group === group.id && (state.checklistFilter === "all" || !state.checklist[item.id]));
  if (!items.length) {
    return `<section class="check-group" aria-labelledby="check-group-${escapeHTML(group.id)}"><div class="check-group__head"><p class="section-label">${escapeHTML(group.label)}</p><h2 id="check-group-${escapeHTML(group.id)}">${escapeHTML(group.title)}</h2></div><p class="empty-note">這一組目前沒有未完成項目。</p></section>`;
  }
  return `
    <section class="check-group" aria-labelledby="check-group-${escapeHTML(group.id)}">
      <div class="check-group__head"><p class="section-label">${escapeHTML(group.label)}</p><h2 id="check-group-${escapeHTML(group.id)}">${escapeHTML(group.title)}</h2><span>${items.length} 項顯示中</span></div>
      <ul class="check-list">${items.map(renderChecklistItem).join("")}</ul>
    </section>`;
}

function renderChecklist() {
  const stats = checklistStats();
  app.innerHTML = `
    <section class="page-intro page-intro--compact">
      <div><p class="eyebrow">裝置內保存 · 版本 ${escapeHTML(tripData.version)}</p><h1>行程 Checklist</h1><p class="page-intro__lede">攜帶物品、藥品、餐廳與票券集中放。勾選狀態只保存在這支裝置，不會同步到外部服務。</p></div>
      <div class="progress-block" aria-live="polite"><span>完成進度</span><strong data-check-progress>${stats.completed} / ${stats.total}</strong><div class="progress-track"><span style="--progress: ${(stats.completed / stats.total) * 100}%"></span></div><small>${stats.remaining ? `還有 ${stats.remaining} 項要處理` : "全部完成"}</small></div>
    </section>
    <section class="checklist-tools" aria-label="待辦篩選與管理">
      <div class="filter-tabs" role="group" aria-label="篩選待辦">
        <button type="button" class="filter-button${state.checklistFilter === "all" ? " is-selected" : ""}" data-check-filter="all" aria-pressed="${state.checklistFilter === "all"}">全部</button>
        <button type="button" class="filter-button${state.checklistFilter === "open" ? " is-selected" : ""}" data-check-filter="open" aria-pressed="${state.checklistFilter === "open"}">未完成</button>
      </div>
      <button type="button" class="text-button text-button--danger" data-reset-checklist>重設所有待辦</button>
    </section>
    <div class="check-groups">${tripData.checklistGroups.map(renderChecklistGroup).join("")}</div>
    <p class="storage-note"><span aria-hidden="true">⌁</span> 使用版本化 localStorage 保存；不同裝置各自獨立。</p>`;
}

function searchText(value) {
  return String(value).toLocaleLowerCase("zh-Hant");
}

function searchEntries() {
  const entries = [];
  for (const day of tripData.days) {
    for (const item of day.timeline) {
      entries.push({
        kind: "行程",
        title: item.title,
        meta: `${day.shortDay} · ${day.date} · ${item.location}`,
        detail: `${item.transport}｜${item.note}｜${item.status}`,
        text: [day.day, day.date, day.title, day.route, item.title, item.location, item.transport, item.note, item.status].join(" "),
        href: `#/day/${day.id}?focus=node-${day.id}-main-${item.id}`
      });
    }
  }
  for (const alternative of tripData.alternatives) {
    for (const item of alternative.timeline) {
      entries.push({
        kind: "D2 備案",
        title: item.title,
        meta: `${alternative.label} · ${item.location}`,
        detail: `${item.transport}｜${item.note}`,
        text: [alternative.label, alternative.title, alternative.summary, item.title, item.location, item.transport, item.note].join(" "),
        href: `#/day/${alternative.dayId}?plan=${alternative.id}&focus=node-${alternative.dayId}-${alternative.id}-${item.id}`
      });
    }
  }
  for (const item of allChecklistItems()) {
    entries.push({
      kind: isCustomChecklistItem(item) ? "自訂待辦" : "待辦",
      title: item.label,
      meta: item.dayId ? `${dayForId(item.dayId).shortDay} · 待辦` : "出發前",
      detail: item.description,
      text: [item.label, item.description, item.group, item.dayId].join(" "),
      href: `#/checklist?focus=check-${item.id}`
    });
  }
  for (const item of tripData.meta.transit) {
    entries.push({ kind: "交通", title: item.title, meta: "旅程資訊 · 交通票券", detail: item.detail, text: [item.title, item.detail, item.guide].join(" "), href: "#/info?focus=transit" });
  }
  for (const group of tripData.meta.references) {
    for (const item of group.items) {
      entries.push({ kind: "參考", title: item.label, meta: `旅程資訊 · ${group.title}`, detail: "外部網站參考。", text: [item.label, group.title].join(" "), href: "#/info?focus=references" });
    }
  }
  return entries;
}

function highlight(value, query) {
  const source = String(value);
  if (!query) return escapeHTML(source);
  const lower = source.toLocaleLowerCase("zh-Hant");
  const needle = searchText(query);
  let cursor = 0;
  let output = "";
  let index = lower.indexOf(needle, cursor);
  while (index !== -1) {
    output += escapeHTML(source.slice(cursor, index));
    output += `<mark>${escapeHTML(source.slice(index, index + query.length))}</mark>`;
    cursor = index + query.length;
    index = lower.indexOf(needle, cursor);
  }
  return output + escapeHTML(source.slice(cursor));
}

function renderSearchResults(query) {
  const normalized = searchText(query.trim());
  const results = normalized ? searchEntries().filter((entry) => searchText(entry.text).includes(normalized)).slice(0, 40) : searchEntries().slice(0, 12);
  const label = normalized ? `找到 ${results.length} 筆結果` : "輸入地名、餐廳、交通或待辦開始搜尋";
  const status = document.querySelector("[data-search-status]");
  const container = document.querySelector("[data-search-results]");
  if (status) status.textContent = label;
  if (!container) return;
  container.innerHTML = results.length
    ? results.map((entry) => `<a class="search-result" href="${escapeHTML(entry.href)}"><span class="search-result__kind">${escapeHTML(entry.kind)}</span><strong>${highlight(entry.title, query)}</strong><small>${highlight(entry.meta, query)}</small><p>${highlight(entry.detail, query)}</p></a>`).join("")
    : `<div class="empty-search"><strong>還沒有符合的內容</strong><p>可以改搜景點、餐廳、車站，或試試「待辦」。</p><a href="#/day/d1">回到第一日</a></div>`;
}

function renderSearch(route) {
  const query = route.query.get("q") || "";
  app.innerHTML = `
    <section class="page-intro page-intro--compact">
      <div><p class="eyebrow">全旅程索引 · 中文／日本語</p><h1>搜尋</h1><p class="page-intro__lede">搜尋五日時間軸、D2 備案、Checklist、交通票券與參考資料。</p></div>
      <p class="search-help">⌘ K<br />快速回到這裡</p>
    </section>
    <form class="search-form" data-search-form role="search">
      <label for="trip-search">搜尋整趟旅程</label>
      <div class="search-form__row"><input id="trip-search" type="search" data-search-input value="${escapeHTML(query)}" placeholder="例如：河口湖、MOKUBA、花火" autocomplete="off" /><button type="submit" class="primary-button">搜尋</button></div>
      <p class="field-helper">也可以輸入日文店名；結果會直接連到日期或資訊區段。</p>
    </form>
    <section class="search-results-wrap" aria-labelledby="search-results-title"><div class="section-line"><div><p class="section-label">索引結果</p><h2 id="search-results-title" data-search-status aria-live="polite"></h2></div></div><div class="search-results" data-search-results></div></section>`;
  renderSearchResults(query);
  focusTarget(route.query.get("focus"));
  document.querySelector("[data-search-input]")?.focus({ preventScroll: true });
}

function renderInfo() {
  const { meta } = tripData;
  app.innerHTML = `
    <section class="page-intro page-intro--compact"><div><p class="eyebrow">旅程資料庫 · ${escapeHTML(meta.sourceUpdated)} 整理</p><h1>旅程資訊</h1><p class="page-intro__lede">航班、住宿、長程交通、行李原則與官方參考連結集中放在這裡。</p></div><div class="info-stamp"><span>基地</span><strong>${escapeHTML(meta.base)}</strong><small>${escapeHTML(meta.baseArea)}</small></div></section>
    <section class="info-section" id="flights" aria-labelledby="flights-title"><div class="section-line"><div><p class="section-label">01 / 航班</p><h2 id="flights-title">去回程</h2></div></div><div class="flight-list">${meta.flights.map((flight) => `<article class="flight-row"><div><span>${escapeHTML(flight.direction)} · ${escapeHTML(flight.date)}</span><strong>${escapeHTML(flight.flight)}</strong></div><div><strong>${escapeHTML(flight.time)}</strong><span>${escapeHTML(flight.route)}</span></div></article>`).join("")}</div></section>
    <section class="info-section" id="transit" aria-labelledby="transit-title"><div class="section-line"><div><p class="section-label">02 / 交通</p><h2 id="transit-title">票券與搭乘提示</h2></div></div><div class="transit-list">${meta.transit.map((item) => `<article class="transit-row"><div><h3>${escapeHTML(item.title)}</h3><p>${escapeHTML(item.detail)}</p></div>${externalLink(item.url, item.guide, "map-link map-link--secondary")}</article>`).join("")}</div></section>
    <section class="info-section" id="packing" aria-labelledby="packing-title"><div class="section-line"><div><p class="section-label">03 / 出發</p><h2 id="packing-title">行李與現場提醒</h2></div></div><ul class="rule-list">${meta.packingNotes.map((note) => `<li>${escapeHTML(note)}</li>`).join("")}</ul></section>
    <section class="info-section" id="references" aria-labelledby="references-title"><div class="section-line"><div><p class="section-label">04 / 參考</p><h2 id="references-title">官方連結與地圖</h2></div><span class="section-note">預設收合 · 外部網站</span></div><div class="reference-list">${meta.references.map((group) => `<details class="reference-group"><summary>${escapeHTML(group.title)}<span aria-hidden="true">＋</span></summary><ul>${group.items.map((item) => `<li>${externalLink(item.url, item.label, "map-link map-link--secondary")}</li>`).join("")}</ul></details>`).join("")}</div></section>
    <p class="privacy-note"><span aria-hidden="true">●</span><span>${escapeHTML(meta.publicNote)}</span></p>`;
}

function focusTarget(focusId) {
  if (!focusId) return;
  requestAnimationFrame(() => {
    const target = document.getElementById(focusId);
    if (!target) return;
    target.scrollIntoView({ block: "center", behavior: "auto" });
    target.querySelector("input, button, a")?.focus({ preventScroll: true });
  });
}

function updateActiveNavigation(route) {
  const activeRoute = route.route === "day" ? "itinerary" : route.route;
  document.querySelectorAll("[data-nav-route]").forEach((link) => {
    const selected = link.dataset.navRoute === activeRoute;
    link.classList.toggle("is-active", selected);
    if (selected) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function render() {
  const route = parseRoute();
  updateActiveNavigation(route);
  if (route.route === "checklist") {
    renderChecklist();
    return;
  }
  if (route.route === "search") {
    renderSearch(route);
    return;
  }
  if (route.route === "info") {
    renderInfo();
    focusTarget(route.query.get("focus"));
    return;
  }
  renderItinerary(dayForId(route.id), route);
}

function navigateToSearch() {
  if (parseRoute().route === "search") {
    document.querySelector("[data-search-input]")?.focus({ preventScroll: true });
  } else {
    window.location.hash = "#/search";
  }
}

document.addEventListener("click", (event) => {
  const openSearch = event.target.closest("[data-open-search]");
  if (openSearch) {
    event.preventDefault();
    navigateToSearch();
    return;
  }

  const planButton = event.target.closest("[data-plan-id]");
  if (planButton) {
    state.activePlans[planButton.dataset.plan] = planButton.dataset.planId;
    render();
    return;
  }

  const filterButton = event.target.closest("[data-check-filter]");
  if (filterButton) {
    state.checklistFilter = filterButton.dataset.checkFilter;
    renderChecklist();
    return;
  }

  const deleteButton = event.target.closest("[data-delete-check-id]");
  if (deleteButton) {
    const item = state.customItems.find((customItem) => customItem.id === deleteButton.dataset.deleteCheckId);
    if (!item || !window.confirm(`確定要刪除「${item.label}」嗎？`)) return;
    state.customItems = state.customItems.filter((customItem) => customItem.id !== item.id);
    delete state.checklist[item.id];
    saveChecklistState();
    renderChecklist();
    return;
  }

  const resetButton = event.target.closest("[data-reset-checklist]");
  if (resetButton && window.confirm("確定要把所有待辦重設為初始狀態嗎？")) {
    state.checklist = defaultChecklist();
    for (const item of state.customItems) state.checklist[item.id] = false;
    state.checklistFilter = "all";
    saveChecklistState();
    renderChecklist();
  }
});

document.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-check-id]");
  if (!checkbox) return;
  state.checklist[checkbox.dataset.checkId] = checkbox.checked;
  saveChecklistState();
  const row = checkbox.closest(".check-row");
  row?.classList.toggle("is-complete", checkbox.checked);
  const stats = checklistStats();
  const progress = document.querySelector("[data-check-progress]");
  const progressBar = document.querySelector(".progress-track > span");
  if (progress) progress.textContent = `${stats.completed} / ${stats.total}`;
  if (progressBar) progressBar.style.setProperty("--progress", `${(stats.completed / stats.total) * 100}%`);
});

document.addEventListener("submit", (event) => {
  const checklistForm = event.target.closest("[data-checklist-form]");
  if (checklistForm) {
    event.preventDefault();
    const formData = new FormData(checklistForm);
    const label = String(formData.get("label") || "").trim().slice(0, 80);
    const group = String(formData.get("group") || "").trim();
    const description = String(formData.get("description") || "").trim().slice(0, 160);
    const message = checklistForm.querySelector("[data-checklist-message]");
    if (!label || !checklistGroupIds.has(group)) {
      if (message) message.textContent = "請填寫項目名稱並選擇分類。";
      return;
    }
    const item = { id: createCustomItemId(), group, dayId: null, label, description };
    state.customItems.push(item);
    state.checklist[item.id] = false;
    saveChecklistState();
    renderChecklist();
    document.getElementById(`check-${item.id}`)?.scrollIntoView({ block: "center" });
    return;
  }

  const form = event.target.closest("[data-search-form]");
  if (!form) return;
  event.preventDefault();
  const value = form.querySelector("[data-search-input]").value.trim();
  window.location.hash = value ? `#/search?q=${encodeURIComponent(value)}` : "#/search";
});

document.addEventListener("input", (event) => {
  const input = event.target.closest("[data-search-input]");
  if (!input) return;
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => renderSearchResults(input.value), 250);
});

window.addEventListener("hashchange", render);
window.addEventListener("online", () => setNetworkState(true));
window.addEventListener("offline", () => setNetworkState(false));
window.addEventListener("keydown", (event) => {
  const isShortcut = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
  if (isShortcut) {
    event.preventDefault();
    navigateToSearch();
  }
});

function setNetworkState(isOnline = navigator.onLine) {
  const target = document.querySelector("[data-network-state]");
  if (!target) return;
  target.textContent = isOnline ? "資料可離線 · 外部連結可另開" : "離線資料可用 · 外部連結暫停";
  target.classList.toggle("is-offline", !isOnline);
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("./sw.js").catch(() => {
    // The itinerary remains usable when the browser blocks installation.
  });
}

render();
setNetworkState();
