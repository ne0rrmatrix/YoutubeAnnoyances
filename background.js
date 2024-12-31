// background.js

chrome.runtime.onInstalled.addListener(() => {
  // Set default state
  chrome.storage.local.set({ scriptEnabled: true });
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && 'scriptEnabled' in changes) {
    const isEnabled = changes.scriptEnabled.newValue;
    chrome.action.setIcon({
      path: isEnabled
        ? {
            "16": "icons/icon-enabled-16.png",
            "32": "icons/icon-enabled-32.png",
            "48": "icons/icon-enabled-48.png",
            "128": "icons/icon-enabled-128.png"
          }
        : {
            "16": "icons/icon-disabled-16.png",
            "32": "icons/icon-disabled-32.png",
            "48": "icons/icon-disabled-48.png",
            "128": "icons/icon-disabled-128.png"
          }
    });
  }
});
