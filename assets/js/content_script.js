var $comments;
var $showCommentsButton, $hideCommentsButton;
var showingComments = false;
var showCommentsButton = "<button id='showCommentsButton' class='yt-uix-button yt-uix-button-size-default yt-uix-expander-head'>Show Comments</button>";
var hideCommentsButton = "<button id='hideCommentsButton' class='yt-uix-button yt-uix-button-size-default yt-uix-expander-head'>Hide Comments</button>";
var defaultChannels = {
    "UCQJT7rpynlR7SSdn3OyuI_Q" : { name: "0LoLEventVods", run: true },
    "UCeyxJjDWDBg6moUMDj9j4Kg" : { name: "1CSEventVods", run: true },
    "UCr5TB_3vBI0-WHuDCd3du9g" : { name: "2DotaVods", run: true },
    "UCY7yjSdhxcw5lQhnSF4Wk-A" : { name: "2DotaVods 2", run: true},
    "UC6cCL29i24P9wT8Kws2iq4Q" : { name: "3HSVods", run: true },
    "UCPhab209KEicqPJFAk9IZEA" : { name: "4Onivia", run: true },
    "UCLhS7bMcch5vodboEGpIPlg" : { name: "6What A Play", run: true },
    "UCvqRdlKsE5Q8mf8YXbdIJLw" : { name: "6LolEsports", run: true },
    "UC-I8d_BjKP6MMsYjZhAtjIA" : { name: "6LolEsports Latino", run: true },
    "UCmvoPMHe9l0ytr9ONu5-1vw" : { name: "6Riot Games Latino", run: true },
    "UCJ6EyrObjc396m3MToJhblQ" : { name: "6LolEsports Oce", run: true },
    "UCiN3B0QRdL4wn1TMJ_cJyMQ" : { name: "6LolEsports Japan", run: true },
    "UC48rkTlXjRd6pnqqBkdV0Mw" : { name: "6LolEsports Brasil", run: true },
    "UCCqnLewexMM7LwGzqpMpPrA" : { name: "6Garena TW", run: true },
    "UCGA73hIgOhANAW_ruTXDKig" : { name: "6Alphadraft", run: true },
    "UC0G2qz-hoaCswQNgoWU_LTw" : { name: "5ESL", run: true },
    "UCPvn7OUsnyc9hINqbY7EmCA" : { name: "6CSGO TV", run: true },
    "UC3EVJoJw7OajdrYmBfCvcdw" : { name: "6FaceIt", run: true },
    "UCBvPF-tKhZVrp_mW_sXAKsg" : { name: "6Game On", run: true },
    "UCbEhNEf6zVdmd4C61Ayvv2w" : { name: "5joindota", run: true },
    "UCQfAxSNTJvLISaFNJ0Dmg8w" : { name: "5Beyond The Summit", run: true },
    "UCbHRJG9q56QvNypQTYNOAtQ" : { name: "6CoolDota2 TV", run: true },
    "UCTQ4Q67NXJVn_dr_BCbh2EA" : { name: "6Hefla TV", run: true },
    "UCJN4ouJkqCpo6OwoK_bEWbA" : { name: "6Rasmus TV", run: true },
    "UCrZTN5qnHqGhZglG3wUWKng" : { name: "6Reynad", run: true },
    "UCP5L0BTkW1pYxlyo6jF2Gvw" : { name: "6TempoStorm", run: true },
    "UClMlqyYOEqfWNOFT_KMVaeA" : { name: "6Twitch Dota 2 Vods", run: true},
    "UCFop53hSZZHsW7_vGDTqCZg" : { name: "6CSGO #3", run: true},
    "UC2u0VkSazsN_of3ifcBKTsA" : { name: "6Hearthstone #2", run: true},
    "UCzSItlUKaVNWbd7ybbfnFhg" : { name: "3MLG", run: true},
    "UCxtHAOtBzl3nWm1d80GZhlQ" : { name: "3ECS", run: true},
    "UCK7CPGf74Fpes6kKLMuAdBg" : { name: "4ELEAGUE", run: true},
    "UCPq2ETz4aAGo2Z-8JisDPIA" : { name: "4ESL Counter-Strike", run: true},
};
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
    chrome.storage.sync.get({
        related: true,
        comments: true,
        length: true,
        channels: defaultChannels
    }, (items) => {
        if (items.channels[channel].run) {
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