const state = {
  student: { firstName: "", lastName: "", email: "" },
  questions: [],
  factors: [],
  answers: {},
  pages: [],
  currentPage: 0,
};

const scaleLabels = {
  1: "საერთოდ არ ვეთანხმები",
  2: "არ ვეთანხმები",
  3: "ნაწილობრივ",
  4: "ვეთანხმები",
  5: "სრულად ვეთანხმები",
};

// broad category per factor code prefix
const categoryNames = { I: "ინტერესები", S: "უნარები", P: "პიროვნული თვისებები", V: "ღირებულებები" };

function show(id) {
  for (const v of document.querySelectorAll(".view")) v.classList.add("hidden");
  document.getElementById(id).classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
}
const loader = (on) => document.getElementById("loader").classList.toggle("hidden", !on);

// ---- Step 1: intro ----
document.getElementById("intro-form").addEventListener("submit", async (e) => {
  e.preventDefault();
  const firstName = document.getElementById("firstName").value.trim();
  const lastName = document.getElementById("lastName").value.trim();
  const email = document.getElementById("email").value.trim();
  const err = document.getElementById("intro-error");
  if (!firstName || !lastName || !email) { err.textContent = "გთხოვთ შეავსოთ ყველა ველი."; return; }
  err.textContent = "";
  state.student = { firstName, lastName, email };

  loader(true);
  try {
    const res = await fetch("/api/questions");
    if (!res.ok) throw new Error("questions");
    const data = await res.json();
    state.questions = data.questions;
    state.factors = data.factors;
    renderQuiz();
    show("view-quiz");
  } catch {
    err.textContent = "კითხვების ჩატვირთვა ვერ მოხერხდა. სცადეთ თავიდან.";
  } finally {
    loader(false);
  }
});

// ---- Step 2: quiz ----
function renderQuiz() {
  document.getElementById("quiz-hello").textContent = `გამარჯობა, ${state.student.firstName}!`;
  document.getElementById("total-count").textContent = state.questions.length;

  const factorName = {};
  for (const f of state.factors) factorName[f.code] = f.name;

  const container = document.getElementById("questions");
  container.innerHTML = "";

  // group questions by factor (header), preserving order -> one page per header
  const groups = [];
  const idx = {};
  for (const q of state.questions) {
    if (!(q.factor in idx)) { idx[q.factor] = groups.length; groups.push({ factor: q.factor, items: [] }); }
    groups[idx[q.factor]].items.push(q);
  }
  state.pages = groups;
  state.currentPage = 0;

  let n = 0;
  groups.forEach((g, pi) => {
    const page = document.createElement("div");
    page.className = "quiz-page factor-group";
    page.dataset.page = pi;
    if (pi !== 0) page.classList.add("hidden");

    const cat = categoryNames[g.factor[0]] || "";
    const h = document.createElement("div");
    h.className = "page-header";
    h.innerHTML = `${cat ? `<span class="cat-badge">${escapeHtml(cat)}</span>` : ""}<h3>${escapeHtml(factorName[g.factor] || g.factor)}</h3>`;
    page.appendChild(h);

    for (const q of g.items) {
      n++;
      const qd = document.createElement("div");
      qd.className = "q";
      qd.id = "q-" + q.id;
      if (q.id in state.answers) qd.classList.add("answered");

      const text = document.createElement("div");
      text.className = "q-text";
      text.innerHTML = `<span class="q-num">${n}.</span>${escapeHtml(q.text)}`;
      qd.appendChild(text);

      const scale = document.createElement("div");
      scale.className = "scale";
      for (let v = 1; v <= 5; v++) {
        const lbl = document.createElement("label");
        lbl.title = scaleLabels[v];
        const checked = state.answers[q.id] === v ? "checked" : "";
        lbl.innerHTML = `<input type="radio" name="${q.id}" value="${v}" ${checked}><span>${v}</span>`;
        if (checked) lbl.classList.add("sel");
        lbl.querySelector("input").addEventListener("change", () => {
          state.answers[q.id] = v;
          for (const s of scale.querySelectorAll("label")) s.classList.remove("sel");
          lbl.classList.add("sel");
          qd.classList.add("answered");
          document.getElementById("quiz-error").textContent = "";
          updateProgress();
        });
        scale.appendChild(lbl);
      }
      qd.appendChild(scale);
      page.appendChild(qd);
    }
    container.appendChild(page);
  });

  showPage(0);
  updateProgress();
}

function showPage(i) {
  const pages = document.querySelectorAll(".quiz-page");
  if (i < 0) i = 0;
  if (i > pages.length - 1) i = pages.length - 1;
  state.currentPage = i;
  pages.forEach((p, pi) => p.classList.toggle("hidden", pi !== i));

  const last = i === pages.length - 1;
  document.getElementById("back-btn").disabled = i === 0;
  document.getElementById("next-btn").classList.toggle("hidden", last);
  document.getElementById("submit-btn").classList.toggle("hidden", !last);
  document.getElementById("page-indicator").textContent = `ნაწილი ${i + 1} / ${pages.length}`;
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// returns list of unanswered question ids on the current page
function unansweredOnPage(i) {
  const g = state.pages[i];
  if (!g) return [];
  return g.items.filter((q) => !(q.id in state.answers)).map((q) => q.id);
}

document.getElementById("next-btn").addEventListener("click", () => {
  const err = document.getElementById("quiz-error");
  const missing = unansweredOnPage(state.currentPage);
  if (missing.length) {
    err.textContent = `გთხოვთ უპასუხოთ ამ ნაწილის ყველა კითხვას (დარჩა ${missing.length}).`;
    const el = document.getElementById("q-" + missing[0]);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }
  err.textContent = "";
  showPage(state.currentPage + 1);
});

document.getElementById("back-btn").addEventListener("click", () => {
  document.getElementById("quiz-error").textContent = "";
  showPage(state.currentPage - 1);
});

function updateProgress() {
  const total = state.questions.length;
  const answered = Object.keys(state.answers).length;
  document.getElementById("answered-count").textContent = answered;
  document.getElementById("progress-fill").style.width = (total ? (answered / total) * 100 : 0) + "%";
}

document.getElementById("submit-btn").addEventListener("click", async () => {
  const err = document.getElementById("quiz-error");
  const total = state.questions.length;
  const answered = Object.keys(state.answers).length;
  if (answered < total) {
    err.textContent = `გთხოვთ უპასუხოთ ყველა კითხვას (${answered}/${total}). დარჩენილია ${total - answered}.`;
    // jump to first page that has a missing answer
    const firstMissing = state.questions.find((q) => !(q.id in state.answers));
    if (firstMissing) {
      const pageIdx = state.pages.findIndex((g) => g.items.some((q) => q.id === firstMissing.id));
      if (pageIdx >= 0) showPage(pageIdx);
      const el = document.getElementById("q-" + firstMissing.id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    return;
  }
  err.textContent = "";

  loader(true);
  try {
    const res = await fetch("/api/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        firstName: state.student.firstName,
        lastName: state.student.lastName,
        email: state.student.email,
        answers: state.answers,
      }),
    });
    const data = await res.json();
    if (!res.ok) { err.textContent = data.error || "შეცდომა. სცადეთ თავიდან."; return; }
    renderResults(data);
    show("view-results");
  } catch {
    err.textContent = "გაგზავნა ვერ მოხერხდა. სცადეთ თავიდან.";
  } finally {
    loader(false);
  }
});

// ---- Step 3: results ----
function renderResults(r) {
  document.getElementById("results-name").textContent = `${r.firstName} ${r.lastName}`;
  document.getElementById("cluster-badge").textContent = `ძირითადი მიმართულება: ${r.primaryClusterName}`;

  const medals = ["🥇", "🥈", "🥉"];
  const top3 = document.getElementById("top3");
  top3.innerHTML = "";
  r.top3.forEach((m, i) => {
    const d = document.createElement("div");
    d.className = "match" + (i === 0 ? " gold" : "");
    d.innerHTML = `
      <div class="rank">${medals[i] || i + 1}</div>
      <div class="info">
        <div class="prof">${escapeHtml(m.profession)}</div>
        <div class="cl">${escapeHtml(m.clusterName)}</div>
      </div>
      <div class="score">${m.score}%</div>`;
    top3.appendChild(d);
  });

  const fc = document.getElementById("factors");
  fc.innerHTML = "";
  for (const f of r.factorScores) {
    const row = document.createElement("div");
    row.className = "frow";
    row.innerHTML = `
      <div class="fname">${escapeHtml(f.name)}</div>
      <div class="fbar"><div class="ffill" style="width:${f.score}%"></div></div>
      <div class="fval">${f.score}</div>`;
    fc.appendChild(row);
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
