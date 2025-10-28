// GET request - Fetch reels
export async function onRequestGet(context) {
    const repoOwner = "ydvkrn";
    const repoName = "Instagram";
    const branch = "main";
    const reelFilePath = "reels.json";
    
    const reelJsonUrl = `https://raw.githubusercontent.com/${repoOwner}/${repoName}/${branch}/${reelFilePath}`;
    
    try {
        const response = await fetch(`${reelJsonUrl}?t=${Date.now()}`, {
            headers: { 'Accept': 'application/json', 'Cache-Control': 'no-cache' }
        });
        
        if (!response.ok) {
            if (response.status === 404) {
                return new Response(JSON.stringify({ reels: [] }), {
                    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
                });
            }
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        return new Response(JSON.stringify(data), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message, reels: [] }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}

// POST request - Update reels
export async function onRequestPost(context) {
    const { request, env } = context;
    const GITHUB_TOKEN = env.GITHUB_TOKEN;
    
    if (!GITHUB_TOKEN) {
        return new Response(JSON.stringify({ error: 'GitHub token missing' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
    
    const repoOwner = "ydvkrn";
    const repoName = "Instagram";
    const branch = "main";
    const reelFilePath = "reels.json";
    const reelApiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${reelFilePath}`;
    
    try {
        const body = await request.json();
        const { data, message } = body;
        
        // Get SHA
        const shaResponse = await fetch(reelApiUrl, {
            headers: { 
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });
        
        if (!shaResponse.ok) throw new Error(`SHA fetch failed: ${shaResponse.status}`);
        
        const fileData = await shaResponse.json();
        
        // Update
        const updateResponse = await fetch(reelApiUrl, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${GITHUB_TOKEN}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message || "Update reels",
                content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
                sha: fileData.sha,
                branch: branch
            })
        });
        
        if (!updateResponse.ok) {
            const errorData = await updateResponse.json();
            throw new Error(errorData.message || updateResponse.status);
        }
        
        return new Response(JSON.stringify({ success: true }), {
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
        
    } catch (error) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
        });
    }
}

// OPTIONS for CORS
export async function onRequestOptions() {
    return new Response(null, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        }
    });
}