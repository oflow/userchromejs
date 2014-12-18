// ==UserScript==
// @name           dblclick Tab Pinned
// @description    タブのダブルクリックでピン留めトグル
// @version        1.0.1
// @include        main
// @compatibility  Firefox ESR31.3, 34.0.5
// @author         oflow
// @namespace      http://oflow.me/archives/330
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
    gBrowser.tabContainer.addEventListener('dblclick', ucjsTabPinned, false);
    window.addEventListener('unload', function uninit() {
        gBrowser.tabContainer.removeEventListener('dblclick', ucjsTabPinned, false);
        window.removeEventListener('unload', uninit, false);
    }, false);
})();
