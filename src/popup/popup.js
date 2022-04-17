const savedMediaTable = document.getElementById("savedMedia");
const savedMediaTheadTr = savedMediaTable
  .getElementsByTagName("thead")[0]
  .getElementsByTagName("tr")[0];
const savedMediaTbody = savedMediaTable.getElementsByTagName("tbody")[0];
const downloadSavedEl = document.getElementById("downloadSaved");
const clearSavedEl = document.getElementById("clearSaved");

const theads = new Set();

chrome.storage.sync.get("savedMedia", ({ savedMedia }) => {
  const mediaArr = Array.isArray(savedMedia) ? [...savedMedia] : [];

  for (const m of mediaArr) {
    const row = savedMediaTbody.insertRow(0);

    Object.keys(m).forEach((key) => {
      theads.add(key);
      const cell = row.insertCell(-1);

      if (key === "url")
        cell.innerHTML = `<code><a href="${m[key]}" target="_blank" referrer="no-referrer">${m[key]}</a></code>`;
      else if (key === "date")
        cell.textContent = new Date(m[key]).toLocaleDateString();
      else if (key === "mediaType") {
        cell.textContent = m[key];
        cell.classList.add("capitalize");
      } else cell.textContent = m[key];
    });
  }

  for (const th of theads)
    savedMediaTheadTr.insertCell(-1).outerHTML = `<th>${th}</th>`;

  const vBlob = new Blob([JSON.stringify(mediaArr)], {
    type: "application/json",
  });

  downloadSavedEl.setAttribute("href", window.URL.createObjectURL(vBlob));
  downloadSavedEl.setAttribute(
    "download",
    `media-${new Date().toISOString()}.json`,
  );

  clearSavedEl.addEventListener("click", () => {
    if (confirm("Are you sure?")) {
      chrome.storage.sync.remove("savedMedia");
      savedMediaTbody.textContent = "";
    }
  });
});
