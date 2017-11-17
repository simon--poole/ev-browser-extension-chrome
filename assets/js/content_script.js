var $comments;
// var $relatedHTML;
// var $showCommentsButton, $hideCommentsButton;
// var showCommentsButton = "<paper-button class='style-scope' id='show_comments'><span class='more-button style-scope ytd-video-secondary-info-renderer'>Show comments</span></paper-button>";
// var hideCommentsButton = "<paper-button class='style-scope' id='hide_comments'><span class='more-button style-scope ytd-video-secondary-info-renderer'>Hide comments</span></paper-button>";
// var relatedButton = "<yt-next-continuation class='style-scope ytd-watch-next-secondary-results-renderer show' role='button' tabindex='0' animated='' aria-disabled='false' elevation='0'><span>Show Related Items</span></paper-button>";

// (document.body || document.documentElement)
// .addEventListener('transitionend', function ( /*TransitionEvent*/ event) {
// 	if (event.propertyName === 'width' && event.target.id === 'progress') {
// 		checkVideoChanged();
// 	}
// }, true);

/* listen for messages from extension */
chrome.runtime.onMessage.addListener(
	function (request, sender, sendResponse) {
		if (request === 'yt-channel-info-request') {
			/* send yt channel id/name  */
			if ($('.yt-user-info > a').attr('href')) {
				var channelId = $('.yt-user-info > a').attr('href').replace(/^\/channel\//, '');
				var channelName = $('.yt-user-info > a').text()
				if (channelId && channelName) {
					sendResponse({
						channelId: channelId,
						channelName: channelName
					});
				}
			}

		}
	});

// function checkVideoChanged() {
// 	if ($('#showCommentsButton')
// 		.length == 0) initialise();
// }

function initialise() {
	if (!$('#owner-name > a').length) return setTimeout(initialise, 500);
	var channel = $('#owner-name > a').attr('href').replace(/^\/channel\//, '');
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
				.on('DOMSubtreeModified', hideRelatedBinder);
			if (items.length) $(document)
				.on('DOMSubtreeModified', hideLengthBinder);
		}
	});
}

function hideCommentsBinder() {
	$comments = $('#comments');
	if ($comments.length > 0) {
		$(document)
			.off('DOMSubtreeModified', hideCommentsBinder);
		hideComments();
	}
}

function hideComments() {
	// $hideCommentsButton.hide();
	// $showCommentsButton.show();
	$comments.hide();
}

// function showComments() {
//     $showCommentsButton.hide();
// 	$hideCommentsButton.show();
//     $comments.show();
// }

function hideRelatedBinder() {
	$(document)
		.off('DOMSubtreeModified', hideRelatedBinder);
	$('body').addClass('hideRelatedItems');
	$('#items').prepend(relatedButton);

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
