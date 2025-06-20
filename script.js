let pfpUrl = "";

async function saveBio() {
  const data = getData();
  if (!data.username || !data.bio) return alert("Username and bio required!");

  await fetch('/api/bio/' + data.username, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ bio: JSON.stringify(data) })
  });

  alert("Saved! View at /u/" + data.username);
}

document.getElementById('pfpUpload').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const formData = new FormData();
  formData.append("image", file);
  const res = await fetch("/api/upload", { method: "POST", body: formData });
  const data = await res.json();
  pfpUrl = data.url;
  updatePreview();
});

function getData() {
  return {
    username: document.getElementById('username').value,
    name: document.getElementById('name').value,
    location: document.getElementById('location').value,
    website: document.getElementById('website').value,
    status: document.getElementById('status').value,
    discord: document.getElementById('discord').value,
    github: document.getElementById('github').value,
    twitter: document.getElementById('twitter').value,
    pfp: pfpUrl,
    bgcolor: document.getElementById('bgcolor').value,
    font: document.getElementById('font').value,
    fontsize: document.getElementById('fontsize').value,
    theme: document.getElementById('theme').value,
    bio: document.getElementById('bio').value,
  };
}

function updatePreview() {
  const d = getData();
  const preview = document.getElementById('preview');

  preview.className = `theme-${d.theme}`;
  preview.style.background = d.bgcolor;
  preview.style.fontFamily = d.font;
  preview.style.fontSize = d.fontsize + "px";

  preview.innerHTML = `
    <img src="${d.pfp}" />
    <h2>${d.name}</h2>
    <p><strong>Status:</strong> ${d.status}</p>
    <p><strong>Location:</strong> ${d.location}</p>
    <p><strong>Website:</strong> <a href="${d.website}" target="_blank">${d.website}</a></p>
    <p><strong>Discord:</strong> ${d.discord}</p>
    <p><strong>GitHub:</strong> <a href="https://github.com/${d.github}" target="_blank">${d.github}</a></p>
    <p><strong>Twitter:</strong> <a href="https://twitter.com/${d.twitter}" target="_blank">@${d.twitter}</a></p>
    <hr>
    ${marked.parse(d.bio)}
  `;
}

document.querySelectorAll('input, textarea, select').forEach(e => {
  e.addEventListener('input', updatePreview);
});

updatePreview();
