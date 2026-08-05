// MUSIC.JS — player real + upload de áudio local.

let playlist = JSON.parse(localStorage.getItem("libraryMusic") || "[]");
let currentIndex = -1;
let audio = null;

const list = document.querySelector("#musicList");
const upload = document.querySelector("#musicUpload");

function renderMusicList(filter = "") {
  const filtered = playlist.filter(song =>
    song.name.toLowerCase().includes(filter.toLowerCase())
  );

  list.innerHTML = filtered.length
    ? filtered.map((song, index) => `
      <article class="row-card">
        <div>🎵</div>
        <div class="grow">
          <strong>${escapeHTML(song.name)}</strong>
          <p>Áudio local</p>
        </div>
        <button class="primary-button" data-play="${index}">Ouvir</button>
      </article>`).join("")
    : `<p class="page-description">Nenhuma música encontrada.</p>`;

  list.querySelectorAll("[data-play]").forEach(button => {
    button.onclick = () => playSong(Number(button.dataset.play));
  });
}

function playSong(index) {
  currentIndex = index;
  const song = playlist[index];
  if (!song) return;

  if (audio) audio.pause();
  audio = new Audio(song.url);
  audio.volume = Number(document.querySelector("#volume").value);

  document.querySelector("#songName").textContent = song.name;
  document.querySelector("#songMeta").textContent = "A tocar agora";
  document.querySelector("#playSong").textContent = "❚❚";

  audio.addEventListener("timeupdate", () => {
    const progress = audio.duration ? audio.currentTime / audio.duration * 100 : 0;
    document.querySelector("#musicProgress").value = progress;
  });

  audio.addEventListener("ended", nextSong);
  audio.play();
}

function nextSong() {
  if (!playlist.length) return;
  playSong((currentIndex + 1) % playlist.length);
}

function previousSong() {
  if (!playlist.length) return;
  playSong((currentIndex - 1 + playlist.length) % playlist.length);
}

upload.addEventListener("change", event => {
  [...event.target.files].forEach(file => {
    playlist.push({
      name: file.name,
      url: URL.createObjectURL(file)
    });
  });

  localStorage.setItem("libraryMusic", JSON.stringify(playlist));
  renderMusicList();
});

document.querySelector("#playSong").onclick = () => {
  if (!audio) return;
  if (audio.paused) {
    audio.play();
    document.querySelector("#playSong").textContent = "❚❚";
  } else {
    audio.pause();
    document.querySelector("#playSong").textContent = "▶";
  }
};

document.querySelector("#nextSong").onclick = nextSong;
document.querySelector("#previousSong").onclick = previousSong;

document.querySelector("#volume").oninput = event => {
  if (audio) audio.volume = Number(event.target.value);
};

document.querySelector("#musicProgress").oninput = event => {
  if (audio?.duration) {
    audio.currentTime = audio.duration * Number(event.target.value) / 100;
  }
};

document.querySelector("#musicSearch").oninput = event => {
  renderMusicList(event.target.value);
};

function escapeHTML(value = "") {
  return value.replace(/[&<>"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

renderMusicList();