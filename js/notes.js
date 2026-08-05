// NOTES.JS — notas, edição, eliminação e calendário.

let notes = JSON.parse(localStorage.getItem("libraryNotes") || "[]");
let calendarDate = new Date();

const notesList = document.querySelector("#notesList");

function saveNotes() {
  localStorage.setItem("libraryNotes", JSON.stringify(notes));
}

function renderNotes(filter = "") {
  const filtered = notes.filter(note =>
    `${note.title} ${note.content}`.toLowerCase().includes(filter.toLowerCase())
  );

  notesList.innerHTML = filtered.length
    ? filtered.map((note, index) => `
      <article class="row-card">
        <div>📝</div>
        <div class="grow">
          <strong>${escapeHTML(note.title)}</strong>
          <p>${escapeHTML(note.content)}</p>
          <small>${new Date(note.date).toLocaleString("pt-PT")}</small>
        </div>
        <div class="note-actions">
          <button data-edit="${index}">Editar</button>
          <button data-delete="${index}">Eliminar</button>
        </div>
      </article>`).join("")
    : `<p class="page-description">Ainda não existem anotações.</p>`;

  notesList.querySelectorAll("[data-edit]").forEach(button => {
    button.onclick = () => openEditor(Number(button.dataset.edit));
  });

  notesList.querySelectorAll("[data-delete]").forEach(button => {
    button.onclick = () => {
      notes.splice(Number(button.dataset.delete), 1);
      saveNotes();
      renderNotes();
      renderCalendar();
    };
  });
}

function openEditor(index = null) {
  const note = index === null
    ? { title: "", content: "" }
    : notes[index];

  const editor = document.createElement("div");
  editor.className = "note-editor";
  editor.innerHTML = `
    <input id="noteTitle" placeholder="Título da nota" value="${escapeHTML(note.title)}">
    <textarea id="noteContent" placeholder="Escreve a tua anotação...">${escapeHTML(note.content)}</textarea>
    <button class="primary-button" id="saveNote">Guardar</button>
    <button id="cancelNote">Cancelar</button>
  `;

  document.querySelector(".page-section").prepend(editor);

  editor.querySelector("#saveNote").onclick = () => {
    const title = editor.querySelector("#noteTitle").value.trim();
    const content = editor.querySelector("#noteContent").value.trim();

    if (!title || !content) {
      alert("Preenche o título e o conteúdo.");
      return;
    }

    const newNote = {
      title,
      content,
      date: note.date || new Date().toISOString()
    };

    if (index === null) notes.unshift(newNote);
    else notes[index] = newNote;

    saveNotes();
    editor.remove();
    renderNotes();
    renderCalendar();
  };

  editor.querySelector("#cancelNote").onclick = () => editor.remove();
}

function renderCalendar() {
  const year = calendarDate.getFullYear();
  const month = calendarDate.getMonth();

  document.querySelector("#calendarTitle").textContent =
    calendarDate.toLocaleDateString("pt-PT", { month: "long", year: "numeric" });

  const calendar = document.querySelector("#calendar");
  const firstDay = new Date(year, month, 1).getDay();
  const days = new Date(year, month + 1, 0).getDate();
  const today = new Date();

  calendar.innerHTML = "";

  for (let i = 0; i < firstDay; i++) calendar.insertAdjacentHTML("beforeend", "<span></span>");

  for (let day = 1; day <= days; day++) {
    const button = document.createElement("button");
    button.textContent = day;

    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) button.classList.add("today");

    calendar.appendChild(button);
  }
}

document.querySelector("#newNote").onclick = () => openEditor();

document.querySelector("#notesSearch").oninput =
  event => renderNotes(event.target.value);

document.querySelector("#prevMonth").onclick = () => {
  calendarDate.setMonth(calendarDate.getMonth() - 1);
  renderCalendar();
};

document.querySelector("#nextMonth").onclick = () => {
  calendarDate.setMonth(calendarDate.getMonth() + 1);
  renderCalendar();
};

function escapeHTML(value = "") {
  return value.replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

renderNotes();
renderCalendar();