// ==UserScript==
// @name           GMarks Menu in Bookmark Toolbar
// @description    GMarksのメニューをブックマークツールバーの先頭に移動させるやつ
// @version        1.0
// @author         oflow
// @compatibility  Firefox 6, 11.0
// @namespace      http://oflow.me/
// ==/UserScript==

(function() {
    var menupopup = document.getElementById('gmarksMenuPopup');
    var toolbaritem = document.createElement('toolbaritem');
    var toolbarbutton = toolbaritem.appendChild(document.createElement('toolbarbutton'));
    toolbarbutton.id = 'ucjs-gmarks-toolbarbutton';
    toolbarbutton.className = 'bookmark-item';
    toolbarbutton.setAttribute('type', 'menu');
    toolbarbutton.setAttribute('label', 'GMarks');
    toolbarbutton.setAttribute('container', 'true');
    // 他と区別しやすいように★のマークに変える
    toolbarbutton.setAttribute('image', 'chrome://browser/skin/places/allBookmarks.png');
    toolbarbutton.appendChild(menupopup);
    var personalBookmarks = document.getElementById('personal-bookmarks');
    if (personalBookmarks) {
        var bookmarkItem = personalBookmarks.getElementsByClassName('bookmark-item');
        if (bookmarkItem) {
            bookmarkItem[0].parentNode.insertBefore(toolbaritem, bookmarkItem[0]);
        }
    }
})();
