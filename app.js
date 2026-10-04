const subjects = [
  {code:"BAMAT101", name:"Multivariable Calculus & Differential Equations", short:"Mathematics", desc:"Partial derivatives, multiple integrals, vector calculus, ODEs and PDEs."},
  {code:"BAPHY101", name:"Applied Physics for Engineers", short:"Applied Physics", desc:"Statics, structures, friction, particle dynamics and rigid body dynamics."},
  {code:"BAEEE101", name:"Basic Engineering", short:"Basic Engineering", desc:"Electrical engineering, electronics, graphics, manufacturing and automation."},
  {code:"BAMEE101", name:"Manufacturing Processes", short:"Manufacturing", desc:"Casting, forming, welding, machining, abrasive finishing and additive manufacturing."}
];

// Verified FAT schedule from the uploaded timetable.
const fatSchedule = {
  BAMEE101: { date: "2026-11-12", display: "12 NOV 2026", reporting: "08:45 AM", exam: "09:30 AM - 12:30 PM", slot: "FN1" },
  BAMAT101: { date: "2026-11-19", display: "19 NOV 2026", reporting: "08:45 AM", exam: "09:30 AM - 12:30 PM", slot: "FN1" },
  BAPHY101: { date: "2026-11-23", display: "23 NOV 2026", reporting: "08:45 AM", exam: "09:30 AM - 12:30 PM", slot: "FN1" },
  BAEEE101: { date: "2026-11-25", display: "25 NOV 2026", reporting: "08:45 AM", exam: "09:30 AM - 12:30 PM", slot: "FN1" }
};

// Paper archive links. Exact-code public collections are used where verified.
// CodeChef-VIT is the original archive; ExamCooker is used only where it exposes
// the exact current course code as a public collection.
const papers = [
  {subject:"BAMAT101", title:"Multivariable Calculus & Differential Equations — paper archive", exam:"ALL", year:"2025-2026", slot:"ALL", url:"https://examcooker.acmvit.in/past_papers/BAMAT101"},
  {subject:"BAMAT101", title:"Calculus — CodeChef-VIT FAT C1", exam:"FAT", year:"2023-2024", slot:"C1", url:"https://www.papers.codechefvit.com/paper/6891bc26f6766a56a03f5af2"},
  {subject:"BAEEE101", title:"Basic Engineering — paper archive", exam:"ALL", year:"2025-2026", slot:"ALL", url:"https://exam-cooker.acmvit.in/past_papers/BAEEE101"},
  {subject:"BAPHY101", title:"Applied Physics for Engineers — CodeChef-VIT catalogue", exam:"ALL", year:"ALL", slot:"ALL", url:"https://www.papers.codechefvit.com/catalogue?subject=Applied+Physics+for+Engineers+%5BBAPHY101%5D"},
  {subject:"BAMEE101", title:"Manufacturing Processes — CodeChef-VIT catalogue", exam:"ALL", year:"ALL", slot:"ALL", url:"https://www.papers.codechefvit.com/catalogue?subject=Manufacturing+Processes+%5BBAMEE101%5D"}
];

const subjectGrid = document.querySelector("#subjects-grid");
subjectGrid.innerHTML = subjects.map(s => `
  <article class="subject" onclick="document.querySelector('#search').value='${s.code}'; renderPapers()">
    <div class="subject-code">${s.code}</div>
    <h3>${s.short}</h3>
    <p>${s.name}</p>
    <span class="subject-arrow">↗</span>
  </article>
`).join("");

const search = document.querySelector("#search");
const examFilter = document.querySelector("#examFilter");
const yearFilter = document.querySelector("#yearFilter");

function renderPapers(){
  const q = search.value.toLowerCase().trim();
  const exam = examFilter.value;
  const year = yearFilter.value;
  const filtered = papers.filter(p =>
    (!q || `${p.subject} ${p.title} ${p.exam} ${p.year} ${p.slot}`.toLowerCase().includes(q)) &&
    (exam === "all" || p.exam === exam || p.exam === "ALL") &&
    (year === "all" || p.year === year || p.year === "ALL")
  );

  const el = document.querySelector("#papers");
  if(!filtered.length){
    el.innerHTML = `<div class="empty">No paper matched those filters.</div>`;
    return;
  }
  el.innerHTML = filtered.map(p => `
    <div class="paper">
      <div class="paper-title">${p.title}</div>
      <div class="paper-meta">${p.exam === "ALL" ? "ARCHIVE" : p.exam}</div>
      <div class="paper-meta">${p.year === "ALL" ? "ALL YEARS" : p.year}</div>
      <a href="${p.url}" target="_blank" rel="noopener">OPEN ↗</a>
    </div>
  `).join("");
}
[search, examFilter, yearFilter].forEach(x => x.addEventListener("input", renderPapers));
renderPapers();

const upcoming = Object.entries(fatSchedule)
  .map(([code, item]) => ({code, ...item, timestamp: new Date(`${item.date}T09:30:00+05:30`).getTime()}))
  .sort((a,b) => a.timestamp - b.timestamp);

const nextExam = upcoming.find(item => item.timestamp > Date.now()) ?? upcoming[upcoming.length - 1];
document.querySelector("#fat-date").textContent = nextExam.display;
document.querySelector("#fat-subject").textContent = subjects.find(s => s.code === nextExam.code)?.short ?? nextExam.code;

document.querySelector("#fat-meta").textContent = `${nextExam.reporting} reporting · ${nextExam.exam} · ${nextExam.slot}`;

function tick(){
  const diff = nextExam.timestamp - Date.now();
  if(diff <= 0){
    document.querySelector("#countdown").innerHTML = '<div><strong>LIVE</strong><small>FAT</small></div>';
    return;
  }
  const d=Math.floor(diff/86400000);
  const h=Math.floor(diff/3600000)%24;
  const m=Math.floor(diff/60000)%60;
  const s=Math.floor(diff/1000)%60;
  document.querySelector("#days").textContent=String(d).padStart(2,"0");
  document.querySelector("#hours").textContent=String(h).padStart(2,"0");
  document.querySelector("#mins").textContent=String(m).padStart(2,"0");
  document.querySelector("#secs").textContent=String(s).padStart(2,"0");
}
tick(); setInterval(tick,1000);
