document.addEventListener('DOMContentLoaded', () => {
  restoreOptions();
  // Add event listeners to checkboxes
  document.getElementById('toggleShorts').addEventListener('change', saveOptions);
  document.getElementById('toggleMembersOnly').addEventListener('change', saveOptions);
});

function saveOptions() {
  const removeShorts = document.getElementById('toggleShorts').checked;
  const removeMembersOnly = document.getElementById('toggleMembersOnly').checked;
  const isEnabled = removeShorts || removeMembersOnly;

  chrome.storage.local.set(
    {
      removeShorts: removeShorts,
      removeMembersOnly: removeMembersOnly,
    },
    () => {
      updateIcon(isEnabled);
      browser.tabs.reload();
    }
  );
}

function restoreOptions() {
  chrome.storage.local.get(['removeShorts', 'removeMembersOnly'], (result) => {
    document.getElementById('toggleShorts').checked = result.removeShorts !== false;
    document.getElementById('toggleMembersOnly').checked = result.removeMembersOnly !== false;
    const isEnabled = result.removeShorts !== false || result.removeMembersOnly !== false;
    updateIcon(isEnabled);
  });
}

function updateIcon(isEnabled) {
  const iconPath = isEnabled
    ? {
        "16": "icons/icon-enabled-16.png",
        "32": "icons/icon-enabled-32.png",
        "48": "icons/icon-enabled-48.png",
        "128": "icons/icon-enabled-128.png",
      }
    : {
        "16": "icons/icon-disabled-16.png",
        "32": "icons/icon-disabled-32.png",
        "48": "icons/icon-disabled-48.png",
        "128": "icons/icon-disabled-128.png",
      };
  chrome.action.setIcon({ path: iconPath });
}
