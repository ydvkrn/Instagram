function setAudioPersistence() {
    localStorage.setItem('audioEnabled', 'true');
    isAudioEnabled = true;
    if (currentVideo) {
        currentVideo.muted = false;
        currentVideo.play().catch((error) => console.log("Play error:", error));
    }
}

async function checkUrlValidity(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        return response.ok;
    } catch (error) {
        console.log(`URL invalid or inaccessible: ${url}`, error);
        return false;
    }
}

function showFullTitle() {
    alert(fullTitle);
}
