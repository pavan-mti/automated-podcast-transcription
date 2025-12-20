const API_BASE = "http://localhost:5000/api";

export async function fetchPodcasts() {
  const res = await fetch(`${API_BASE}/podcasts`);

  if (!res.ok) {
    throw new Error("Failed to fetch podcasts");
  }

  return res.json();
}

export async function fetchSegments(podcastId, params = "") {
  const res = await fetch(
    `${API_BASE}/podcasts/${podcastId}/segments${params}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch segments");
  }

  return res.json();
}

export async function uploadAudio(file) {
  const formData = new FormData();
  formData.append("audio", file);

  const res = await fetch(`${API_BASE}/upload`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    throw new Error("Upload failed");
  }

  return res.json();
}
