// LIBRARY.JS — documentos e livros.
// O PDF abre no navegador. Word/Excel ficam registados nesta versão.

let documents = JSON.parse(localStorage.getItem("libraryDocuments") || "[]");

const fileInput = document.querySelector("#documentUpload");
const documentList = document.querySelector("#documentList");

function renderDocuments(filter = "") {
  const filtered = documents.filter(doc =>
    doc.name.toLowerCase().includes(filter.toLowerCase())
  );

  documentList.innerHTML = filtered.length
    ? filtered.map(doc => {
        const originalIndex = documents.indexOf(doc);
        return `
      <article class="row-card">
        <div>📄</div>
        <div class="grow">
          <strong>${escapeHTML(doc.name)}</strong>
          <p>${doc.read ? "✓ Lido" : "Ainda não lido"} · ${doc.type}</p>
        </div>
        <button class="primary-button" data-open="${originalIndex}">Abrir</button>
        <button data-read="${originalIndex}" title="Marcar como lido">✓</button>
        <button data-remove="${originalIndex}" title="Remover documento">Remover</button>
      </article>`;
      }).join("")
    : `<p class="page-description">A biblioteca está vazia.</p>`;

  documentList.querySelectorAll("[data-open]").forEach(button => {
    button.onclick = () => {
      const doc = documents[Number(button.dataset.open)];
      window.open(doc.url, "_blank");
    };
  });

  documentList.querySelectorAll("[data-read]").forEach(button => {
    button.onclick = () => {
      documents[Number(button.dataset.read)].read = true;
      localStorage.setItem("libraryDocuments", JSON.stringify(documents));
      renderDocuments(filter);
    };
  });

  documentList.querySelectorAll("[data-remove]").forEach(button => {
    button.onclick = () => {
      const idx = Number(button.dataset.remove);
      const name = documents[idx] ? documents[idx].name : "este documento";
      if (!confirm(`Remover "${name}" da biblioteca?`)) return;
      // liberar object URL para evitar vazamento de memória
      try { if (documents[idx] && documents[idx].url) URL.revokeObjectURL(documents[idx].url); } catch (e) {}
      documents.splice(idx, 1);
      localStorage.setItem("libraryDocuments", JSON.stringify(documents));
      renderDocuments(filter);
    };
  });
}

fileInput.addEventListener("change", event => {
  [...event.target.files].forEach(file => {
    documents.unshift({
      name: file.name,
      type: file.type || "documento",
      url: URL.createObjectURL(file),
      read: false
    });
  });

  localStorage.setItem("libraryDocuments", JSON.stringify(documents));
  renderDocuments();
});

document.querySelector("#librarySearch").oninput =
  event => renderDocuments(event.target.value);

function escapeHTML(value = "") {
  return value.replace(/[&<>\"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

renderDocuments();
