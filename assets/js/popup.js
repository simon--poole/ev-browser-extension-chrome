var related, comments, length, scope;

function initialise() {
    related = document.getElementById('related');
    comments = document.getElementById('comments');
    length = document.getElementById('length');
    chrome.storage.sync.get({
        related: true,
        comments: true,
        length: true,
        channels: defaultChannels
    }, (items) => {
        var update = false;
        related.checked = items.related;
        comments.checked = items.comments;
        length.checked = items.length;
        scope = angular.element('body').scope();
        scope.$apply(function(){
            scope.channels = items.channels;//items.channels;
        });
    });

    related.addEventListener('change', saveChanges);
    comments.addEventListener('change', saveChanges);
    length.addEventListener('change', saveChanges);

    /* get channel id/name from active tab (if on youtube) */
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        if (getHostNameFromUrl(tabs[0].url).match(/^(www\.)?youtube\.com$/))  {
            chrome.tabs.sendMessage(tabs[0].id, "yt-channel-info-request", function(response) {
                if (response) {
                    chrome.storage.sync.get({channels: defaultChannels}, function(items) {
                        if (items.channels[response.channelId] === undefined)   {
                            /* yt-channel in active tab is not in channel list -> show add button */
                            scope.$apply(function() {
                                scope.currentChannel = {
                                    id: response.channelId,
                                    name: response.channelName,
                                    displayAddButton: true
                                }
                            });
                        }
                    });
                }
            });
        }
    });
}

function saveChanges() {
    chrome.storage.sync.set({
        related: related.checked,
        comments: comments.checked,
        length: length.checked
    });
}

function getHostNameFromUrl(url)   {
    var p = document.createElement('a');
    p.href = url;
    return p.hostname;
}

document.addEventListener('DOMContentLoaded', initialise, false);
