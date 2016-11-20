var $comments;
var $showCommentsButton, $hideCommentsButton;
var showingComments = false;
var showCommentsButton = "<button id='showCommentsButton' class='yt-uix-button yt-uix-button-size-default yt-uix-expander-head'>Show Comments</button>";
var hideCommentsButton = "<button id='hideCommentsButton' class='yt-uix-button yt-uix-button-size-default yt-uix-expander-head'>Hide Comments</button>";

(document.body || document.documentElement)
.addEventListener('transitionend', function( /*TransitionEvent*/ event) {
    if (event.propertyName === 'width' && event.target.id === 'progress') {
        checkVideoChanged();
    }
}, true);

/* listen for messages from extension */
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request === "yt-channel-info-request") {
            /* send yt channel id/name  */
            var channelId = $('.yt-user-info > a').attr('data-ytid');
            var channelName = $('.yt-user-info > a').text()
            if (channelId && channelName)  {
                sendResponse({
                    channelId: channelId,
                    channelName: channelName
                });
            }
        }
    });

function checkVideoChanged() {
    if ($('#showCommentsButton')
        .length == 0) initialise();
}

function initialise() {
    var channel = $('.yt-user-info > a')
        .attr('data-ytid');
    chrome.storage.sync.get({
        related: true,
        comments: true,
        length: true,
        channels: defaultChannels
    }, (items) => {
        if (items.channels[channel] && items.channels[channel].run) {
            if (items.comments) $(document)
                .on('DOMSubtreeModified', hideCommentsBinder);
            if (items.related) $(document)
                .on('DOMSubtreeModified', hideRelatedItemsBinder);
            if (items.length) $(document)
                .on('DOMSubtreeModified', hideLengthBinder);
        }
    });
}

function hideCommentsBinder() {
    $comments = $('#watch-discussion');
    if ($comments.length > 0) {
        $(document)
            .off('DOMSubtreeModified', hideCommentsBinder);
        $comments.before(showCommentsButton);
        $comments.before(hideCommentsButton);
        $showCommentsButton = $('#showCommentsButton');
        $hideCommentsButton = $('#hideCommentsButton');
        hideCommentsLoop();
        $comments.on('DOMSubtreeModified', hideCommentsLoop);
    }
}

function hideCommentsLoop() {
    if (!showingComments) hideComments();
}

function hideComments() {
    showingComments = false;
    $comments.hide();
    $hideCommentsButton.hide();
    $showCommentsButton.show()
        .on('click', showComments)
}

function showComments() {
    showingComments = true;
    $showCommentsButton.hide();
    $hideCommentsButton.show()
        .on('click', hideComments);
    $comments.show();
}

function hideRelatedItemsBinder() {
    $('.watch-sidebar, #player-playlist')
        .remove();
    $('.watch-main-col')
        .css('margin', 'auto')
        .css('float', 'none');
    if ($('#player')
        .hasClass('watch-small')) {
        $('#player-api, #placeholder-player')
            .css('left', ($('#player-mole-container')
                .width() - $('#player-api')
                .width()) / 2 + 'px');
    }
}

function hideLengthBinder() {
    if ($('.ytp-progress-bar-container')
        .length > 0) {
        $(document)
            .off('DOMSubtreeModified', hideLengthBinder);
        $('.ytp-time-duration, .ytp-time-separator')
            .remove();
        $('.ytp-progress-bar-container')
            .text('Video length hidden - use arrow keys to seek')
            .css('text-align', 'center');
    }
}

initialise();
