const capitalizeFirstLetter = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const toastEl = document.createElement("div");
toastEl.id = "mediasaver-webext-toast";

const toastTitleEl = document.createElement("span");
const toastMessageEl = document.createElement("span");

toastEl.appendChild(toastTitleEl);
toastEl.appendChild(toastMessageEl);

document.body.appendChild(toastEl);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  const { mediaType, url, date } = request;
  if (!mediaType) return;

  toastTitleEl.textContent = `${capitalizeFirstLetter(mediaType)} saved!`;
  toastMessageEl.innerHTML = `<a href="${url}" target="_blank" referrer="no-referrer">${url}</a>`;

  toastEl.classList.add("show");

  setTimeout(() => {
    toastEl.classList.remove("show");
  }, 3000);

  sendResponse();
});
