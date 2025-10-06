let isPlaying = false;
let currentTrackIndex = 0;
let selectedGenres = [];
let progressInterval = null;
let currentProgress = 0;
let volume = 1;
let isMuted = false;

/* Extended track list (order MUST match the cards in index.html) */
const tracks = [
  // Original
  { title: 'Blinding Lights', artist: 'The Weeknd', icon: '🌟', duration: '3:20', durationSeconds: 200 },
  { title: 'Shape of You', artist: 'Ed Sheeran', icon: '🎵', duration: '3:53', durationSeconds: 233 },
  { title: 'Levitating', artist: 'Dua Lipa', icon: '✨', duration: '3:23', durationSeconds: 203 },
  { title: 'Good 4 U', artist: 'Olivia Rodrigo', icon: '🎤', duration: '2:58', durationSeconds: 178 },
  { title: 'Stay', artist: 'The Kid LAROI & Justin Bieber', icon: '🔥', duration: '2:21', durationSeconds: 141 },

  // Hindi
  { title: 'Kesariya', artist: 'Arijit Singh', icon: '🧡', duration: '3:30', durationSeconds: 210 },
  { title: 'Tum Hi Ho', artist: 'Arijit Singh', icon: '💖', duration: '4:22', durationSeconds: 262 },
  { title: 'Sun Raha Hai (Female)', artist: 'Shreya Ghoshal', icon: '🌸', duration: '5:08', durationSeconds: 308 },
  { title: 'Raataan Lambiyan', artist: 'Jubin Nautiyal & Asees Kaur', icon: '🌙', duration: '3:50', durationSeconds: 230 },

  // Telugu
  { title: 'Butta Bomma', artist: 'Armaan Malik (Telugu)', icon: '🪘', duration: '3:17', durationSeconds: 197 },
  { title: 'Samajavaragamana', artist: 'Sid Sriram', icon: '🎶', duration: '3:48', durationSeconds: 228 },
  { title: 'Ee Sanje Eegaali', artist: 'S. P. Balasubrahmanyam', icon: '💿', duration: '4:10', durationSeconds: 250 },

  // Tamil
  { title: 'Vaathi Coming', artist: 'Anirudh Ravichander', icon: '💃', duration: '3:03', durationSeconds: 183 },
  { title: 'Why This Kolaveri Di', artist: 'Dhanush', icon: '🤟', duration: '4:20', durationSeconds: 260 },
  { title: 'Thalli Pogathey', artist: 'Sid Sriram', icon: '🌊', duration: '4:12', durationSeconds: 252 },

  // Malayalam
  { title: 'Jimikki Kammal', artist: 'Vineeth Sreenivasan & Renjith Unni', icon: '🕺', duration: '3:50', durationSeconds: 230 },
  { title: 'Kudukku', artist: 'Sushin Shyam', icon: '🥁', duration: '3:05', durationSeconds: 185 },
  { title: 'Pavizha Mazha', artist: 'K. S. Harisankar', icon: '💧', duration: '4:40', durationSeconds: 280 }
];

/* Keep your original functions/behavior intact */
function selectGenre(genre) {
  const genreCard = event.target.closest('.genre-card');

  if (selectedGenres.includes(genre)) {
    selectedGenres = selectedGenres.filter(g => g !== genre);
    genreCard.style.opacity = '1';
    genreCard.style.border = 'none';
  } else {
    selectedGenres.push(genre);
    genreCard.style.opacity = '0.8';
    genreCard.style.border = '3px solid white';
  }

  // Visual feedback for selection
  genreCard.style.transform = 'scale(0.95)';
  setTimeout(() => { genreCard.style.transform = 'scale(1.05)'; }, 100);
}

function showSongsPage() {
  if (selectedGenres.length === 0) {
    alert('Please select at least one genre to continue!');
    return;
  }
  document.getElementById('genreSelection').classList.add('hidden');
  document.getElementById('songsPage').classList.remove('hidden');
}

function playTrack(title, artist) {
  if (progressInterval) clearInterval(progressInterval);

  currentTrackIndex = tracks.findIndex(t => t.title === title && t.artist === artist);
  const track = tracks[currentTrackIndex];

  document.getElementById('currentSong').textContent = title;
  document.getElementById('currentArtist').textContent = artist;
  document.getElementById('playerIcon').textContent = track.icon;
  document.getElementById('totalTime').textContent = track.duration;

  document.getElementById('musicPlayer').classList.remove('hidden');
  isPlaying = true;
  currentProgress = 0;
  document.getElementById('playPauseIcon').textContent = '⏸️';

  updatePlayButtons();
  startProgress();
}

function togglePlay() {
  isPlaying = !isPlaying;
  document.getElementById('playPauseIcon').textContent = isPlaying ? '⏸️' : '▶️';

  if (isPlaying) startProgress();
  else if (progressInterval) clearInterval(progressInterval);

  updatePlayButtons();
}

function previousTrack() {
  currentTrackIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
  const track = tracks[currentTrackIndex];
  playTrack(track.title, track.artist);
}

function nextTrack() {
  currentTrackIndex = (currentTrackIndex + 1) % tracks.length;
  const track = tracks[currentTrackIndex];
  playTrack(track.title, track.artist);
}

function toggleVolume() {
  const volumeIcon = document.getElementById('volumeIcon');
  isMuted = !isMuted;
  if (isMuted) { volumeIcon.textContent = '🔇'; volume = 0; }
  else { volumeIcon.textContent = '🔊'; volume = 1; }
}

function updatePlayButtons() {
  const playButtons = document.querySelectorAll('.music-card .play-button span');
  playButtons.forEach((button, index) => {
    if (index === currentTrackIndex && isPlaying) button.textContent = '⏸️';
    else button.textContent = '▶️';
  });
}

function startProgress() {
  if (progressInterval) clearInterval(progressInterval);
  const track = tracks[currentTrackIndex];

  progressInterval = setInterval(() => {
    if (!isPlaying) return;

    currentProgress += 1; // 1 second tick
    if (currentProgress >= track.durationSeconds) {
      currentProgress = 0;
      nextTrack();
      return;
    }

    const progressPercent = (currentProgress / track.durationSeconds) * 100;
    document.getElementById('progressBar').style.width = progressPercent + '%';

    const minutes = Math.floor(currentProgress / 60);
    const seconds = currentProgress % 60;
    document.getElementById('currentTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }, 1000);
}

/* Progress seek */
document.addEventListener('DOMContentLoaded', function() {
  const progressContainer = document.querySelector('#musicPlayer .w-32.bg-gray-200');
  if (progressContainer) {
    progressContainer.addEventListener('click', function(e) {
      if (currentTrackIndex >= 0) {
        const rect = this.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const progressPercent = (clickX / rect.width) * 100;

        const track = tracks[currentTrackIndex];
        currentProgress = Math.floor((progressPercent / 100) * track.durationSeconds);

        document.getElementById('progressBar').style.width = progressPercent + '%';

        const minutes = Math.floor(currentProgress / 60);
        const seconds = currentProgress % 60;
        document.getElementById('currentTime').textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      }
    });
  }
});

/* Search */
function searchSongs() {
  const searchInput = document.querySelector('input[placeholder="Search songs..."]');
  const musicCards = document.querySelectorAll('.music-card');

  searchInput.addEventListener('input', function() {
    const searchTerm = this.value.toLowerCase();
    musicCards.forEach(card => {
      const title = card.querySelector('h3').textContent.toLowerCase();
      const artist = card.querySelector('p').textContent.toLowerCase();
      card.style.display = (title.includes(searchTerm) || artist.includes(searchTerm)) ? 'flex' : 'none';
    });
  });
}
document.addEventListener('DOMContentLoaded', searchSongs);

/* Keyboard shortcuts */
document.addEventListener('keydown', function(e) {
  if (document.getElementById('musicPlayer').classList.contains('hidden')) return;

  switch(e.code) {
    case 'Space': e.preventDefault(); togglePlay(); break;
    case 'ArrowLeft': e.preventDefault(); previousTrack(); break;
    case 'ArrowRight': e.preventDefault(); nextTrack(); break;
    case 'KeyM': e.preventDefault(); toggleVolume(); break;
  }
});