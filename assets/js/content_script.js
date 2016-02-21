var $comments;
var $showCommentsButton, $hideCommentsButton;
var showingComments = false;
var showCommentsButton = "<button id='showCommentsButton' class='yt-uix-button yt-uix-button-size-default yt-uix-expander-head'>Show Comments</button>";
var hideCommentsButton = "<button id='hideCommentsButton' class='yt-uix-button yt-uix-button-size-default yt-uix-expander-head'>Hide Comments</button>";
var channels = [ //channel whitelist, youtube id
    'loleventvods', //loleventvods
    'UCQJT7rpynlR7SSdn3OyuI_Q', //also loleventvods
    'UCeyxJjDWDBg6moUMDj9j4Kg', //csvods
    'UCr5TB_3vBI0-WHuDCd3du9g', //dotavods
    'UC6cCL29i24P9wT8Kws2iq4Q', //hsvods
    'UCPhab209KEicqPJFAk9IZEA', //onivia highlights
    'UCLhS7bMcch5vodboEGpIPlg', //what a play highlights
    'UCvqRdlKsE5Q8mf8YXbdIJLw', //lolesports
    'UC-I8d_BjKP6MMsYjZhAtjIA', //lolesports latin america
    'UCmvoPMHe9l0ytr9ONu5-1vw', //riotgames latino
    'UCJ6EyrObjc396m3MToJhblQ', //lolesports oce
    'UCiN3B0QRdL4wn1TMJ_cJyMQ', //lolesports japan
    'UC48rkTlXjRd6pnqqBkdV0Mw', //lolesports br
    'UCCqnLewexMM7LwGzqpMpPrA', //garena tw
    'UCGA73hIgOhANAW_ruTXDKig', //alphadraft
    'UC0G2qz-hoaCswQNgoWU_LTw', //esl
    'UCPvn7OUsnyc9hINqbY7EmCA', //csgo tv
    'UC3EVJoJw7OajdrYmBfCvcdw', //faceit
    'UCBvPF-tKhZVrp_mW_sXAKsg', //game on
    'UCHq-FOX_hMDGZEwdBGZe1uw', //gfinity
    'UCbEhNEf6zVdmd4C61Ayvv2w', //joindota
    'UC6vQmbHIu4Ksd4U0EIAVbrg', //"dota 2 esports tv"
    'UCQfAxSNTJvLISaFNJ0Dmg8w', //beyond the summit
    'UClMlqyYOEqfWNOFT_KMVaeA', //"twitch dota 2 vods"
    'UCbHRJG9q56QvNypQTYNOAtQ', //cooldota2 tv
    'UCTQ4Q67NXJVn_dr_BCbh2EA', //hefla tv
    'UCJN4ouJkqCpo6OwoK_bEWbA', //rasmus tv
    'UCrZTN5qnHqGhZglG3wUWKng', //reynad
    'UCP5L0BTkW1pYxlyo6jF2Gvw', //tempostorm
];
(document.body || document.documentElement)
.addEventListener('transitionend', function( /*TransitionEvent*/ event) {
    if (event.propertyName === 'width' && event.target.id === 'progress') {
        checkVideoChanged();
    }
}, true);

function checkVideoChanged() {
    if ($('#showCommentsButton')
        .length == 0) initialise();
}

function initialise() {
    var channel = $('.yt-user-info > a')
        .attr('data-ytid');
    if ($.inArray(channel, channels) > -1) {
        chrome.storage.sync.get({
            related: true,
            comments: true,
            length: true
        }, (items) => {
            if (items.comments) $(document)
                .on('DOMSubtreeModified', hideCommentsBinder);
            if (items.related) $(document)
                .on('DOMSubtreeModified', hideRelatedItemsBinder);
            if (items.length) $(document)
                .on('DOMSubtreeModified', hideLengthBinder);
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
            .text('Video length hidden - use arrow keys to seek')
            .css('text-align', 'center');
    }
}
initialise();