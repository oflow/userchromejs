// ==UserScript==
// @name           Copy Link Text Lite
// @description    Adds "Copy Link Text" menu to the context menu.
// @compatibility  Firefox 2.0, 3.0, 12,0
// @author         oflow
// @version        1.0
// ==/UserScript==

(function() {
	var menuLabel = {
		en: 'Copy Link Text',
		ja: '\u30ea\u30f3\u30af\u3055\u308c\u305f\u30c6\u30ad\u30b9\u30c8\u3092\u30b3\u30d4\u30fc',
	};
	var menuLanguage = menuLabel[navigator.language.substring(0, 2)] ? navigator.language.substring(0, 2) : 'en';
	var copyMenu = {
		id:          'context-copylink-text',
		accesskey:   'T',
		label:       menuLabel[menuLanguage],
		insertAfter: 'context-copylink',
	};
	var textContent = '';
	init: {
		var contextMenu = document.getElementById('contentAreaContextMenu');
		contextMenu.addEventListener('popupshowing', copyLinkText, false);
		var menuItem = document.createElement('menuitem');
		menuItem.setAttribute('id',        copyMenu.id);
		menuItem.setAttribute('accesskey', copyMenu.accesskey);
		menuItem.setAttribute('label',     copyMenu.label);
		contextMenu.insertBefore(menuItem, document.getElementById(copyMenu.insertAfter).nextSibling);
	}
	function copyLinkText() {
		menuItem = document.getElementById(copyMenu.id);
		menuItem.hidden = true;
		if (!gContextMenu.onLink) return;
		var text = gContextMenu.target.textContent;
		if (!text) return;
		text = text.replace(/^[\r\n\t\u3000 ]+/, '');
		text = text.replace(/[\r\n\t\u3000 ]+$/, '');
		text = text.replace(/[\r\n ]+/g, ' ');
		textContent = text;
		menuItem.addEventListener('command', function() {
			Cc["@mozilla.org/widget/clipboardhelper;1"].getService(Ci.nsIClipboardHelper).copyString(textContent);
		}, false);
		menuItem.hidden = false;
	}
})();