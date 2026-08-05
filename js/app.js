// ============================================================
// APP.JS — controla a navegação.
// Cada página tem o seu próprio HTML e o seu próprio JS.
// ============================================================

const pages = {
  home: { html: "pages/home.html", js: "js/home.js", title: "Início" },
  music: { html: "pages/music.html", js: "js/music.js", title: "Música" },
  library: { html: "pages/library.html", js: "js/library.js", title: "Biblioteca" },
  learn: { html: "pages/learn.html", js: "js/learn.js", title: "Aprenda" },
  notes: { html: "pages/notes.html", js: "js/notes.js", title: "Anotações" }
};

async function loadPage(pageName) {
  const page = pages[pageName] || pages.home;
  const app = document.querySelector("#app");

  const response = await fetch(page.html);
  app.innerHTML = `<div class="app-shell">${await response.text()}</div>`;

  const navButtons = document.querySelectorAll(".nav-link");
  navButtons.forEach(btn => {
    btn.classList.toggle("active", btn.dataset.page === pageName);
    btn.addEventListener("click", () => loadPage(btn.dataset.page));
  });

  // Carrega o JS específico daquela página.
  const script = document.createElement("script");
  script.src = `${page.js}?v=${Date.now()}`;
  document.body.appendChild(script);
}

window.loadPage = loadPage;

loadPage("home");