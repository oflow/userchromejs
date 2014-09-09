// ==UserScript==
// @name           GMarks Menu in Bookmark Toolbar
// @description    GMarksのメニューをブックマークツールバーの先頭に移動させるやつ
// @version        1.1
// @author         oflow
// @compatibility  Firefox ESR 24.8, Firefox ESR 31
// @namespace      http://oflow.me/archives/492
// ==/UserScript==

(function() {
    var menupopup = document.getElementById('gmarksMenuPopup');
    var toolbarbutton = document.createElement('toolbarbutton');
    toolbarbutton.id = 'ucjs-gmarks-toolbarbutton';
    toolbarbutton.className = 'bookmark-item';
    toolbarbutton.setAttribute('type', 'menu');
    toolbarbutton.setAttribute('label', 'GMarks');
    toolbarbutton.setAttribute('container', 'true');
    // 他と区別しやすいように★のマークに変える
    toolbarbutton.setAttribute('image', 'chrome://browser/skin/places/allBookmarks.png');
    toolbarbutton.appendChild(menupopup);
    var personalBookmarks = document.getElementById('PlacesToolbarItems');
    if (personalBookmarks) {
        var bookmarkItem = personalBookmarks.getElementsByClassName('bookmark-item');
        if (bookmarkItem && bookmarkItem[0]) {
            bookmarkItem[0].parentNode.insertBefore(toolbarbutton, bookmarkItem[0]);
        } else {
            personalBookmarks.appendChild(toolbarbutton);
        }
    }
})();
