var related, comments, length;
document.addEventListener('DOMContentLoaded', initialise, false);

function initialise() {
    related = document.getElementById('related');
    comments = document.getElementById('comments');
    length = document.getElementById('length');
    chrome.storage.sync.get({
        related: true,
        comments: true,
        length: true
    }, (items) => {
        related.checked = items.related;
        comments.checked = items.comments;
        length.checked = items.length;
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