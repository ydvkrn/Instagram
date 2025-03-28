let allReels = [];
const container = document.getElementById('reels-container');

async function loadData() {
    try {
        // Fetch profiles.json and reels.json directly from GitHub repo
        const [profilesResponse, reelsResponse] = await Promise.all([
            fetch('https://raw.githubusercontent.com/ydvkrn/Instagram/refs/heads/main/profiles.json')
                .then(res => {
                    if (!res.ok) throw new Error('Profiles fetch failed: ' + res.status);
                    return res.json();
                }),
            fetch('https://raw.githubusercontent.com/ydvkrn/Instagram/refs/heads/main/reels.json')
                .then(res => {
                    if (!res.ok) throw new Error('Reels fetch failed: ' + res.status);
                    return res.json();
                })
        ]);

        const profiles = profilesResponse.profiles || [];
        allReels = reelsResponse.reels || [];

        if (allReels.length === 0) {
            container.innerHTML = '<div style="color: white; text-align: center; padding-top: 50%;">No reels available.</div>';
            return { profiles, success: false };
        }

        console.log('Reels Loaded from GitHub:', allReels);

        // Initialize likes for each reel
        allReels.forEach(reel => {
            if (!likes.has(reel.reelId)) {
                likes.set(reel.reelId, { count: 0, liked: false });
            }
        });

        return { profiles, success: true };
    } catch (error) {
        console.error('Error loading data from GitHub:', error);
        container.innerHTML = '<div style="color: white; text-align: center; padding-top: 50%;">Loading failed. Retrying...</div>';
        setTimeout(() => loadData(), 2000); // Retry after 2 seconds
        return { profiles: [], success: false };
    }
}
