const saveMedia = (event) => {
  const { pageUrl, srcUrl, mediaType = "", linkUrl } = event;

  const media = {
    url: null,
    mediaType,
    date: new Date().toISOString(),
  };

  if (srcUrl) {
    media.url = srcUrl;
  } else if (linkUrl) {
    media.url = linkUrl;
    media.mediaType = "link";
  } else if (pageUrl) {
    media.url = pageUrl;
    media.mediaType = "page";
  }

  chrome.storage.sync.get("savedMedia", ({ savedMedia }) => {
    const appendedMedia = Array.isArray(savedMedia)
      ? [...savedMedia, media]
      : [media];

    chrome.storage.sync.set({ savedMedia: appendedMedia });

    // chrome.notifications.create("notif_saveMedia", {
    //   type: "basic",
    //   iconUrl: "/images/icon-48.png",
    //   title: `${capitalizeFirstLetter(media.mediaType)} saved!`,
    //   message: media.url,
    // });

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.sendMessage(tabs[0].id, media, () => {});
    });
  });
};

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    title: "Save",
    id: "save",
    contexts: ["image", "video", "link", "audio", "selection", "page"],
  });
});

chrome.contextMenus.onClicked.addListener((event) => {
  switch (event.menuItemId) {
    case "save":
      saveMedia(event);
      break;
    default:
      console.error("Unknown menuItemId: ", event);
      chrome.notifications.create("unknown_menuItemId", {
        type: "basic",
        iconUrl: "/images/icon-48.png",
        title: "Failed",
        message: JSON.stringify(event),
      });
  }
});
