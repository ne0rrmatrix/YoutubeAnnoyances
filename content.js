(function () {
  let removeShorts, removeMembersOnly;
  chrome.storage.local.get(['removeShorts', 'removeMembersOnly'], (result) => {
    removeShorts = result.removeShorts !== false; // Default to true
    removeMembersOnly = result.removeMembersOnly !== false; // Default to true

    if (removeShorts || removeMembersOnly) {
      initScript(removeShorts, removeMembersOnly);
    }
  });

  function initScript(removeShorts, removeMembersOnly) {
    // observer variable is already declared in the outer scope
    function removeElements() {
      if (removeShorts) {
        removeShortsElements();
      }
      if (removeMembersOnly) {
        removeMembersOnlyElements();
      }
    }

    function removeShortsElements() {
      const elements = document.querySelectorAll('a#endpoint[title="Shorts"]');
      elements.forEach((node) => {
        if (node) {
          node.parentNode.removeChild(node);
          console.log(`Removed Shorts node: ${node.outerHTML}`);
        }
      });
    }

    function removeMembersOnlyElements() {
      // Use XPath to find text nodes containing "Members Only"
      const xpathResult = document.evaluate(
        "//text()[contains(., 'Members Only')]",
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null
      );

      // Listen for changes in storage to update options dynamically
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local') {
        if(changes.removeShorts !== undefined) {
          removeShorts = changes.removeShorts.newValue;
        }
          
        
        if (changes.removeMembersOnly !== undefined) {
          removeMembersOnly = changes.removeMembersOnly.newValue;
        }
      }
        if (removeShorts || removeMembersOnly) {
          initScript();
        } else if (observer) {
          // If both options are disabled, disconnect the observer
          observer.disconnect();
          observer = null;
          browser.tabs.reload();
        }
      });

      // Iterate over found text nodes and remove their parent nodes
      for (let i = 0; i < xpathResult.snapshotLength; i++) {
        const textNode = xpathResult.snapshotItem(i);
        const parent = textNode.parentNode;
        if (parent?.parentNode) {
          parent.parentNode.removeChild(parent);
          console.log(`Removed Members Only node: ${parent.outerHTML}`);
        }
      }
    }

    // Initial removal
    removeElements();

    // Observe changes to the DOM for dynamic content
    let observer = new MutationObserver(() => {
      removeElements();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    };
})();
