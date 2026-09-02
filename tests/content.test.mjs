import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import { tripData } from "../site/data/trip-data.js";

const publicFiles = [
  "../site/app.js",
  "../site/data/trip-data.js",
  "../site/index.html",
  "../site/manifest.webmanifest",
  "../site/sw.js"
];

test("public trip data contains five uniquely identified days", () => {
  assert.equal(tripData.days.length, 5);
  assert.equal(new Set(tripData.days.map((day) => day.id)).size, 5);
  assert.deepEqual(tripData.days.map((day) => day.day), ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"]);
});

test("canonical content decisions are represented", () => {
  const d1 = tripData.days.find((day) => day.id === "d1");
  const d3 = tripData.days.find((day) => day.id === "d3");
  const d4 = tripData.days.find((day) => day.id === "d4");
  const d5 = tripData.days.find((day) => day.id === "d5");

  assert.match(d1.anchors.find((anchor) => anchor.label === "墨田水族館").kind, /票券待確認/);
  assert.equal(d3.anchors.find((anchor) => anchor.label.includes("焼肉いのうえ")).time, "20:00");
  assert.match(d4.anchors.find((anchor) => anchor.label.includes("東京 → 熱海")).time, /^14:57/);
  assert.match(d5.summary, /MIYUKI Factory 本次取消/);
  assert.match(d5.summary, /早餐／早午餐.*二選一/);
  assert.equal(tripData.alternatives[0].id, "d2-plan-b");
});

test("every day exposes a standardised, map-ready timeline", () => {
  for (const day of tripData.days) {
    assert.ok(day.timeline.length >= 8, `${day.id} should have a full timeline`);
    assert.equal(new Set(day.timeline.map((item) => item.id)).size, day.timeline.length);
    for (const item of day.timeline) {
      for (const field of ["time", "start", "end", "title", "location", "transport", "note", "status", "mapUrl"]) {
        assert.ok(item[field], `${day.id}/${item.id} is missing ${field}`);
      }
      assert.match(item.mapUrl, /^https:\/\//);
    }
  }
});

test("checklist has versioned initial state and local-only groups", () => {
  assert.equal(tripData.version, 3);
  assert.ok(tripData.checklist.length >= 30);
  assert.equal(new Set(tripData.checklist.map((item) => item.id)).size, tripData.checklist.length);
  assert.deepEqual(new Set(tripData.checklist.map((item) => item.group)), new Set(["packing", "medicine", "restaurants", "tickets", "before", "shopping"]));
  assert.deepEqual(tripData.checklistGroups.map((group) => group.id), ["packing", "medicine", "restaurants", "tickets", "before", "shopping"]);
  assert.ok(tripData.checklist.some((item) => item.id === "personal-medicine" && item.label === "個人藥品"));
  assert.ok(tripData.checklist.some((item) => item.id === "insurance-application" && item.label.includes("保險")));
  assert.ok(tripData.checklist.some((item) => item.id === "visit-japan-web" && item.label.includes("Visit Japan Web")));
  assert.ok(tripData.checklist.some((item) => item.id === "hair-dryer" && item.label === "吹風機"));
  assert.ok(tripData.checklist.some((item) => item.id === "mask" && item.label === "口罩"));
  assert.ok(tripData.checklist.some((item) => item.id === "clothes" && item.label.includes("換洗衣物")));
  assert.ok(!tripData.checklist.some((item) => item.label === "薄外套"));
  assert.ok(tripData.checklist.some((item) => item.id === "d5-cancel-miyuki" && item.done));
});

test("checklist supports local custom items", async () => {
  const appSource = await readFile(new URL("../site/app.js", import.meta.url), "utf8");
  assert.match(appSource, /customItems/);
  assert.match(appSource, /data-checklist-form/);
  assert.match(appSource, /data-delete-check-id/);
  assert.match(appSource, /customItems: state\.customItems/);
});

test("public app does not contain private Notion or booking secrets", async () => {
  const publicSource = (await Promise.all(publicFiles.map((file) => readFile(new URL(file, import.meta.url), "utf8")))).join("\n");
  assert.doesNotMatch(publicSource, /app\.notion\.com|MYGIYM/i);
  assert.doesNotMatch(publicSource, /需網路|需要網路/);
});

test("all deployable external links use explicit URLs", async () => {
  const dataSource = await readFile(new URL("../site/data/trip-data.js", import.meta.url), "utf8");
  assert.doesNotMatch(dataSource, /app\.notion\.com/i);
  for (const day of tripData.days) {
    assert.match(day.mapUrl, /^https:\/\//);
  }
  for (const referenceGroup of tripData.meta.references) {
    for (const reference of referenceGroup.items) assert.match(reference.url, /^https:\/\//);
  }
});

test("PWA and Pages release files are present", async () => {
  const manifest = JSON.parse(await readFile(new URL("../site/manifest.webmanifest", import.meta.url), "utf8"));
  const serviceWorker = await readFile(new URL("../site/sw.js", import.meta.url), "utf8");
  const workflow = await readFile(new URL("../.github/workflows/pages.yml", import.meta.url), "utf8");

  assert.equal(manifest.start_url, "./");
  assert.equal(manifest.display, "standalone");
  assert.match(serviceWorker, /CACHE_NAME = "tokyo-travel-v3"/);
  assert.match(serviceWorker, /caches\.match\("\.\/index\.html"\)/);
  assert.match(workflow, /npm run build/);
  assert.match(workflow, /actions\/deploy-pages@v4/);
});

test("public page requests no indexing and crawler controls are present", async () => {
  const index = await readFile(new URL("../site/index.html", import.meta.url), "utf8");
  const robots = await readFile(new URL("../site/robots.txt", import.meta.url), "utf8");
  assert.match(index, /name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex"/);
  assert.match(index, /name="googlebot" content="noindex, nofollow, noarchive, nosnippet, noimageindex"/);
  assert.ok(robots.includes("User-agent: GPTBot\nDisallow: /"));
  assert.ok(robots.includes("User-agent: Google-Extended\nDisallow: /"));
  assert.ok(robots.includes("User-agent: OAI-SearchBot\nAllow: /"));
});
