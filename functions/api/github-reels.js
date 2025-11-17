export async function onRequestGet() {
  try {
    // GitHub se data fetch karo
    const response = await fetch('https://raw.githubusercontent.com/ydvkrn/Instagram/main/reels.json');
    const data = await response.json();
    
    return new Response(JSON.stringify(data), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPost({ request }) {
  try {
    const body = await request.json();
    
    // GitHub API se update karo (token environment variable mein rakhna)
    // GITHUB_TOKEN, REPO, etc.
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}