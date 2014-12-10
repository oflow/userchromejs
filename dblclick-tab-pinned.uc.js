// ==UserScript==
// @name           dblclick Tab Pinned
// @description    タブのダブルクリックでピン留めトグル
// @version        1.0
// @include        main
// @compatibility  Firefox 4.0, 11.0, ESR31.3, 34.0.5
// @author         oflow
// @namespace      http://oflow.me/
// ==/UserScript==

(function() {
    var ucjsTabPinned = function(e) {
        var tab = e.target;
        if (e.button != 0 || tab.localName != 'tab') {
            return;
        }
        if (tab.pinned) {
            gBrowser.unpinTab(tab);
        } else {
            gBrowser.pinTab(tab);
        }
        e.preventDefault();
        e.stopPropagation();
    };
    gBrowser.mTabContainer.addEventListener('dblclick', ucjsTabPinned, false);
})();
