// MUSIC.JS — player real + upload de áudio local.

let playlist = JSON.parse(localStorage.getItem("libraryMusic") || "[]");
let currentIndex = -1;
let audio = null;

const list = document.querySelector("#musicList");
const upload = document.querySelector("#musicUpload");

function renderMusicList(filter = "") {
  // keep original indexes so play/remove work even when filtered
  const indexed = playlist.map((song, idx) => ({ song, idx }));
  const filtered = indexed.filter(({ song }) =>
    song.name.toLowerCase().includes(filter.toLowerCase())
  );

  list.innerHTML = filtered.length
    ? filtered.map(({ song, idx }) => `
      <article class="row-card">
        <div>🎵</div>
        <div class="grow">
          <strong>${escapeHTML(song.name)}</strong>
          <p>Áudio local</p>
        </div>
        <div class="row-actions">
          <button class="primary-button" data-play="${idx}">Ouvir</button>
          <button class="danger-button" data-remove="${idx}" title="Remover">✖</button>
        </div>
      </article>`).join("")
    : `<p class="page-description">Nenhuma música encontrada.</p>`;

  list.querySelectorAll("[data-play]").forEach(button => {
    button.onclick = () => playSong(Number(button.dataset.play));
  });

  list.querySelectorAll("[data-remove]").forEach(button => {
    button.onclick = () => removeSong(Number(button.dataset.remove));
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

function removeSong(index) {
  const song = playlist[index];
  if (!song) return;

  // if removing currently playing song, stop playback
  const wasPlayingCurrent = (index === currentIndex);

  // revoke blob URL if applicable
  try {
    if (song.url && typeof song.url === 'string' && song.url.startsWith('blob:')) {
      URL.revokeObjectURL(song.url);
    }
  } catch (e) {
    console.warn('Falha ao revogar URL do objeto:', e);
  }

  // remove from playlist
  playlist.splice(index, 1);

  // adjust currentIndex
  if (playlist.length === 0) {
    currentIndex = -1;
  } else if (wasPlayingCurrent) {
    // stop playback and reset UI
    if (audio) {
      audio.pause();
      audio = null;
    }
    currentIndex = -1;
    document.querySelector("#songName").textContent = "Nenhuma música";
    document.querySelector("#songMeta").textContent = "Adicione uma música do dispositivo.";
    document.querySelector("#playSong").textContent = "▶";
  } else if (index < currentIndex) {
    currentIndex -= 1; // shift left because array shrank
  }

  localStorage.setItem("libraryMusic", JSON.stringify(playlist));
  renderMusicList();
}

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
  return value.replace(/[&<>\"']/g, char => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[char]));
}

renderMusicList();
