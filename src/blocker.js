import blacklist from '../blacklist.js';

function isSiteAllowed(url) {
    for(let blockedSite of blacklist) {
        if(blockedSite.hostname == url.hostname) {
            if(blockedSite.allowedPaths && hasAllowedPath(blockedSite, url)) {
                continue;
            }
            return false;
        }
    }

    return true;
}

function hasAllowedPath(blockedSite, url) {
    for(let allowedPath of blockedSite.allowedPaths) {
        let parsedPath = allowedPath;

        // I asume that there those are the last two characters of the string and are no others like those
        if(allowedPath.includes("/*")) {
            parsedPath = parsedPath.slice(0, parsedPath.length - 1);
        }

        return url.pathname.includes(parsedPath);
    }
}

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const url = new URL(tab.url);

    if(!isSiteAllowed(url)) {
        chrome.tabs.remove(tabId);
    }

});

