let fullTitle = "";
let isAudioEnabled = localStorage.getItem('audioEnabled') === 'true' || false;
let currentIndex = 0;
let touchStartY = 0;
let isTransitioning = false;
let likes = new Map(); // Map to store like counts for each reel
let lastTap = 0; // For double-tap detection

const urlParams = new URLSearchParams(window.location.search);
const initialReelId = urlParams.get('reelId') || null;

const profilePic = document.getElementById('profile-pic');
const usernameText = document.getElementById('username-text');
const usernameContainer = document.getElementById('username');
const verifyBadge = document.getElementById('verify-badge');
const title = document.getElementById('title');

function getProfileById(id) {
    return profiles.find(profile => profile.id === id) || { 
        username: "bot", 
        profile: "https://i.postimg.cc/3Rh3SjRb/image.jpg", 
        verified: true
    };
}

async function loadReel(index) {
    if (index < 0 || index >= allReels.length) {
        console.warn('Index out of bounds:', index);
        return;
    }

    container.innerHTML = '<div id="loading" style="color: white; text-align: center; padding-top: 50%;">Loading...</div>';
    const existingProgress = document.querySelector('.progress-bar');
    if (existingProgress) existingProgress.remove();

    const reel = allReels[index];
    const videoElement = await createVideoElement(reel, index);
    if (videoElement) {
        container.innerHTML = ''; // Clear loading
        container.appendChild(videoElement);
        currentVideo = videoElement.querySelector('video');
        window.history.pushState({}, document.title, `/Instagram/?reelId=${allReels[index].reelId}`);
    }
}

function nextReel() {
    if (currentIndex + 1 < allReels.length) {
        currentIndex++;
        loadReel(currentIndex);
    }
}

function prevReel() {
    if (currentIndex > 0) {
        currentIndex--;
        loadReel(currentIndex);
    }
}

function enableScrollPlayback() {
    let touchStartY = 0;
    let touchMoveY = 0;
    let isHolding = false;

    container.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
        touchMoveY = touchStartY;
        isHolding = true;
        clearTimeout(holdTimer);
        holdTimer = setTimeout(() => {
            if (isHolding && currentVideo) currentVideo.pause();
        }, 500);
    });

    container.addEventListener('touchmove', (e) => {
        touchMoveY = e.touches[0].clientY;
    });

    container.addEventListener('touchend', (e) => {
        if (isTransitioning) return;
        const touchEndY = e.changedTouches[0].clientY;
        const swipeDistance = touchStartY - touchEndY;

        clearTimeout(holdTimer);
        if (isHolding && Math.abs(swipeDistance) < 50 && currentVideo) {
            currentVideo.play().catch(() => {});
        } else if (swipeDistance > 50) {
            isTransitioning = true;
            nextReel();
            setTimeout(() => { isTransitioning = false; }, 100);
        } else if (swipeDistance < -50) {
            isTransitioning = true;
            prevReel();
            setTimeout(() => { isTransitioning = false; }, 100);
        }
        isHolding = false;

        // Double-tap to like
        const now = new Date().getTime();
        const timeSinceLastTap = now - lastTap;
        if (timeSinceLastTap < 300 && timeSinceLastTap > 0) {
            const reel = allReels[currentIndex];
            const reelLikes = likes.get(reel.reelId);
            reelLikes.count += 1;
            const touchX = e.changedTouches[0].clientX;
            const touchY = e.changedTouches[0].clientY;
            showLikeAnimation(touchX, touchY);
        }
        lastTap = now;
    });

    profilePic.addEventListener('click', () => {
        const profileId = profilePic.dataset.id;
        window.open(`profiles.html?id=${profileId}`, '_blank');
    });

    usernameContainer.addEventListener('click', () => {
        const profileId = usernameContainer.dataset.id;
        window.open(`profiles.html?id=${profileId}`, '_blank');
    });
}

async function initialize() {
    const { profiles: loadedProfiles, success } = await loadData();
    if (!success) return;

    profiles = loadedProfiles; // Store profiles globally for getProfileById

    currentIndex = initialReelId ? 
        allReels.findIndex(reel => reel.reelId === initialReelId) : 
        0;
    if (currentIndex === -1) currentIndex = 0;

    loadReel(currentIndex);
    enableScrollPlayback();
}

let profiles = []; // Global variable for profiles
initialize();
