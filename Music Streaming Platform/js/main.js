const resultList = document.getElementById("resultList");
const searchBtn = document.querySelector(".search-container button");
const searchInput = document.querySelector(".search-container input");
const musicbar = document.getElementById("musicbar");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const barCloseBtn = document.getElementById("barCloseBtn");
const song = document.getElementById("song");
const currentTimeDisplay = document.getElementById("currentTime");
const trackDurationDisplay = document.getElementById("trackDuration");
const rangeBar = document.getElementById("rangebar");

let currentTrack = null;
let isChangingRange = false;

async function searchfunc(searchValue) {
    try {
        const response = await fetch("./list.json");
        const data = await response.json();

        resultList.innerHTML = "";

        const filteredTracks = data.filter(track =>
            track["track-name"].toLowerCase().includes(searchValue.toLowerCase())
        );

        if (filteredTracks.length === 0) {
            console.log("No tracks found matching the search criteria.");
            resultList.innerHTML = "<h4>No tracks found matching the search criteria.</h4>";
            return;
        }

        filteredTracks.forEach(track => {
            const li = document.createElement("li");
            li.classList.add("tracks");

            const trackDetail = document.createElement("div");
            trackDetail.classList.add("trackDetail");

            const coverImg = document.createElement("img");
            coverImg.src = track["cover-img"];
            coverImg.alt = "cover.png";
            trackDetail.appendChild(coverImg);

            const trackTitle = document.createElement("div");
            trackTitle.classList.add("trackTitle");
            trackTitle.innerHTML = `<span>${track["track-name"]}</span><p>${track["artist-name"]}</p>`;
            trackDetail.appendChild(trackTitle);

            const trackBtnDiv = document.createElement("div");
            trackBtnDiv.classList.add("trackBtnDiv");

            const menuBtn = document.createElement("button");
            menuBtn.classList.add("appBtn", "menuBtn");
            menuBtn.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
            trackBtnDiv.appendChild(menuBtn);

            li.appendChild(trackDetail);
            li.appendChild(trackBtnDiv);

            li.addEventListener("click", () => {
                playTrack(track);
            });

            resultList.appendChild(li);
        });

    } catch (error) {
        console.error("Error fetching or parsing data:", error);
    }
}

searchBtn.addEventListener("click", event => {
    const searchValue = searchInput.value.trim();
    if (searchValue !== "") {
        searchfunc(searchValue);
    } else {
        //console.log("Please enter a search term.");
        resultList.innerHTML = "Please enter a search term.";
    }
});

playPauseBtn.addEventListener("click", event => {
    if (song.paused) {
        song.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        song.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

function playTrack(track) {
    if (track === currentTrack) {
        song.currentTime = 0;
        song.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        currentTrack = track;
        song.src = track["location"];
        song.play();
        updateMusicBar(track);
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
}

function updateMusicBar(track) {
    const trackImg = musicbar.querySelector("img");
    const trackName = musicbar.querySelector("#trackInfo span");
    const artistName = musicbar.querySelector("#trackInfo p");

    if(track["cover-img"] == ""){
        trackImg.src = "music/images/icons8-music-64.png";
    }
    else{
        trackImg.src = track["cover-img"];
    }
    trackName.textContent = track["track-name"];
    artistName.textContent = track["artist-name"];
    musicbar.classList.remove("hidden");

    song.addEventListener("timeupdate", () => {
        if (!isChangingRange) {
            const currentTime = song.currentTime;
            const duration = song.duration;
            
            const minutes = Math.floor(currentTime / 60);
            const seconds = Math.floor(currentTime % 60);
            const currentTimeFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            const durationMinutes = Math.floor(duration / 60);
            const durationSeconds = Math.floor(duration % 60);
            const trackDurationFormatted = `${durationMinutes}:${durationSeconds.toString().padStart(2, '0')}`;
            
            currentTimeDisplay.textContent = currentTimeFormatted;
            trackDurationDisplay.textContent = trackDurationFormatted;
            
            const progress = (currentTime / duration) * 100;
            rangeBar.value = progress;
        }
    });
}

nextBtn.addEventListener("click", event => {
    song.currentTime = song.duration;
    song.pause();
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
});

prevBtn.addEventListener("click", event => {
    if(!song.paused){
        song.currentTime = 0;
        song.play();
        playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    }
    else{
        song.currentTime = 0;
        song.pause();
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
});

rangeBar.addEventListener("input", () => {
    const progress = rangeBar.value;
    const duration = song.duration;
    const currentTime = (progress / 100) * duration;
    song.currentTime = currentTime;
});

barCloseBtn.addEventListener("click", () => {
    song.pause();
    song.currentTime = 0;
    musicbar.classList.add("hidden");
    currentTrack = null;
    playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
});
