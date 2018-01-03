/* 2017-12-29 Justin Steel (justinsteel@yahoo.com) -- Modified code away from screen scraping to Google's YouTube API v3.  We strip the video ID via the query parameter "V" from all URLs from YouTube's domain
and then query YouTube's API for the channel ID for said video ID via a JSON async call.  Once the channel ID and channel name are populated the code executes as before
This extension is exteremely well done by a professional, Simon Poole on Github.  All credit to the original author at EventVODs.com*/
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
            // 2017-12-29 Justin Steel - Remote call to YouTube Data API v3 to get channel ID from video ID.  This prevents the extension from relying on YouTube's HTML and screen scraping
            //                           we're also limited by Google's API which restricts reads to 1,000,000 calls a day.  I think we'll be fine for several years :)
            var urlParams = new URLSearchParams(window.location.search);
            var videoId = urlParams.get('v'); // "video id"
            var channelId;
            var channelName;
            var queryURL = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + videoId + '&fields=items(snippet(channelId%2CchannelTitle))&key=AIzaSyAl7AqhGl5VQidwYpcWi7PhBssrdZzOqkQ';
                $.getJSON(queryURL, function(data) {
                })
                .done(function(data) {
                // 2017-12-28 Justin Steel - Send the channel ID and name over to popup.html so it's prepopulated if we need to add         
                    channelId = data.items[0].snippet.channelId;
                    channelName = data.items[0].snippet.channelTitle;
                    sendResponse({
                        channelId: channelId,
                        channelName: channelName
                });
            });
            // 2017-12-29 Justin Steel - enable the asynch return to sendMessage
            return true;            
        }
    });

function checkVideoChanged() {
    if ($('#showCommentsButton')
        .length == 0) initialise();
}

function initialise() {
    var channel;
    var urlParams = new URLSearchParams(window.location.search);
    var videoId = urlParams.get('v'); // "video id"
    if (videoId)
    {
        var queryURL = 'https://www.googleapis.com/youtube/v3/videos?part=snippet&id=' + videoId + '&fields=items(snippet(channelId%2CchannelTitle))&key=AIzaSyAl7AqhGl5VQidwYpcWi7PhBssrdZzOqkQ';
        $.getJSON(queryURL, function(data) {
            channel = data.items[0].snippet.channelId;
        })
        .done(function() {
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
        });      
    }   
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
            .text('video length hidden - use arrow keys to seek')
            .css('text-align', 'center');
    }
}

initialise();
