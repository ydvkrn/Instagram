let allReels = [];
const container = document.getElementById('reels-container');

async function loadData() {
    try {
        const [profilesResponse, reelsResponse] = await Promise.all([
            fetch('https://raw.githubusercontent.com/ydvkrn/Instagram/refs/heads/main/profiles.json').then(res => {
                if (!res.ok) throw new Error('Profiles fetch failed');
                return res.json();
            }),
            fetch('https://raw.githubusercontent.com/ydvkrn/Instagram/refs/heads/main/reels.json').then(res => {
                if (!res.ok) throw new Error('Reels fetch failed');
                return res.json();
            })
        ]);

        const profiles = profilesResponse.profiles || [];
        let reels = reelsResponse.reels || [];

        if (reels.length === 0) {
            container.innerHTML = '<div style="color: white; text-align: center; padding-top: 50%;">No reels available.</div>';
            return { profiles, success: false };
        }

        // Filter out invalid URLs
        allReels = [];
        for (const reel of reels) {
            const isValid = await checkUrlValidity(reel.media);
            if (isValid) {
                allReels.push(reel);
            } else {
                console.warn(`Skipping invalid URL: ${reel.media}`);
            }
        }

        if (allReels.length === 0) {
            container.innerHTML = '<div style="color: white; text-align: center; padding-top: 50%;">No valid reels available.</div>';
            return { profiles, success: false };
        }

        console.log('Valid Reels Loaded:', allReels);

        // Initialize likes for each reel
        allReels.forEach(reel => {
            if (!likes.has(reel.reelId)) {
                likes.set(reel.reelId, { count: 0, liked: false });
            }
        });

        return { profiles, success: true };
    } catch (error) {
        console.error('Error loading data:', error);
        container.innerHTML = '<div style="color: white; text-align: center; padding-top: 50%;">Loading failed. Retrying...</div>';
        setTimeout(() => loadData(), 2000);
        return { profiles: [], success: false };
    }
}
