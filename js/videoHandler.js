let currentVideo = null;

function createVideoElement(reel, index) {
    const div = document.createElement('div');
    div.className = 'video-container';

    const video = document.createElement('video');
    video.playsInline = true;
    video.controls = false;
    video.muted = !isAudioEnabled;
    video.dataset.index = index;
    video.dataset.title = reel.title;
    video.src = reel.media;
    video.preload = 'auto'; // Preload video
    video.setAttribute('playsinline', ''); // Mobile compatibility
    video.setAttribute('webkit-playsinline', ''); // iOS compatibility

    const progressBar = document.createElement('div');
    progressBar.className = 'progress-bar';
    document.body.appendChild(progressBar);

    video.addEventListener('canplay', () => {
        console.log(`Video can play: ${reel.media}`);
        currentVideo = video;
        updateMetadata(reel);
        video.play().catch((error) => console.log(`Play error for ${reel.media}:`, error));
    });

    video.addEventListener('timeupdate', () => {
        if (!video.paused) {
            const progress = (video.currentTime / video.duration) * 100;
            progressBar.style.width = `${progress}%`;
        }
    });

    video.addEventListener('ended', () => {
        console.log(`Video ended: ${reel.media}`);
        video.currentTime = 0; // Reset to start
        video.play().catch((error) => console.log(`Loop play error for ${reel.media}:`, error));
    });

    video.addEventListener('error', (e) => {
        console.error(`Unexpected error for ${reel.media}:`, e);
        nextReel(); // Skip if unexpected failure
    });

    video.addEventListener('touchstart', (e) => {
        e.preventDefault();
        if (!isAudioEnabled) {
            setAudioPersistence();
        }
    });

    div.appendChild(video);
    return div;
}

function updateMetadata(reel) {
    fullTitle = reel.title;
    title.innerText = reel.title;
    const profileData = getProfileById(reel.id);
    profilePic.src = profileData.profile || "https://i.postimg.cc/3Rh3SjRb/image.jpg";
    usernameText.innerText = profileData.username;
    verifyBadge.style.display = profileData.verified ? "inline" : "none";
    profilePic.dataset.id = reel.id;
    usernameContainer.dataset.id = reel.id;
}

function showLikeAnimation(x, y) {
    const likeImg = document.createElement('img');
    likeImg.src = 'https://i.postimg.cc/pr68HrJm/1000063176-removebg-preview.png';
    likeImg.className = 'like-animation';
    likeImg.style.left = `${x}px`;
    likeImg.style.top = `${y}px`;
    container.appendChild(likeImg);
    setTimeout(() => likeImg.remove(), 500); // Remove after 0.5s animation
}
