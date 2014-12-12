// ==UserScript==
// @name           WheelScroll Tab
// @description    タブバー上のマウスホイールでタブを切り替え
// @version        1.0
// @include        main
// @compatibility  Firefox ESR31.3, 34.0.5
// @author         oflow
// @namespace      http://oflow.me/
// ==/UserScript==

(function() {
    /*
     * advanceSelectecTab
     * https://developer.mozilla.org/en-US/docs/Mozilla/Tech/XUL/Method/advanceSelectedTab
     *
     */
    // 端のタブまで行ったらループするか
    const WHEELSCROLL_LOOP = false;
    var ucjsWheelScrollTab = function(e) {
        if (e.shiftKey || e.ctrlKey) {
            return;
        }
        gBrowser.tabContainer.advanceSelectedTab((e.detail > 0 ? -1 : 1), WHEELSCROLL_LOOP);
        e.stopPropagation();
    };
    gBrowser.tabContainer.addEventListener('DOMMouseScroll', ucjsWheelScrollTab, true);
    window.addEventListener('beforeunload', function() {
        gBrowser.tabContainer.removeEventListener('DOMMouseScroll', ucjsWheelScrollTab, true);
        window.removeEventListener('beforeunload', arguments.callee, false);
    }, false);
})();

