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
        for(var key in defaultChannels){
            if(typeof channels[key] == "undefined"){
                channels[key] = defaultChannels[key];
                chrome.storage.sync.set({
                    channels: channels
                });
            }
        }
    });
    related.addEventListener('change', saveChanges);
    comments.addEventListener('change', saveChanges);
    length.addEventListener('change', saveChanges);
}

function saveChanges() {
    chrome.storage.sync.set({
        related: related.checked,
        comments: comments.checked,
        length: length.checked
    });
}

document.addEventListener('DOMContentLoaded', initialise, false);
