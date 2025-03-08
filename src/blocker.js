import blacklist from '../blacklist.js';

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    const url = new URL(tab.url);

    if(!isSiteAllowed(url)) {
        chrome.tabs.remove(tabId);
    }

});


function isSiteAllowed(url) {
    for(let blockedSite of blacklist) {
        if(blockedSite.hostname == url.hostname) {
            if(hasAllowedPath(blockedSite, url)) {
                continue;
            }
            return false;
        }
    }

    return true;
}


function hasAllowedPath(blockedSite, url) {
    // If there are no paths allowed then return false
    if(!blockedSite.allowedPaths || blockedSite.length == 0) return false;

    for(let allowedPath of blockedSite.allowedPaths) {
        let parsedPath = allowedPath;

        // I assume that those are the last two characters of the string and are no others like them
        if(allowedPath.includes("/*")) {
            parsedPath = parsedPath.slice(0, parsedPath.length - 1);
        }

        if(url.pathname.includes(parsedPath)) {
            return true;
        }
    }

    return false;
}