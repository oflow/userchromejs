// ==UserScript==
// @name           middle-click "Undo Close Tab"
// @description    タブバー上のミドルクリックで閉じたタブを元に戻すだけ
// @version        1.1
// @include        main
// @compatibility  Firefox ESR31.3, 34.0.5
// @author         oflow
// @namespace      https://oflow.me/archives/265
// @note           Firefox 31.3, 34.0.5 で動作確認
// @note           remove arguments.callee
// @note           mTabContainer -> tabContainer
// ==/UserScript==

(function() {
    var ucjsUndoCloseTab = function(e) {
        // ミドルクリックのみ
        if (e.button != 1) {
            return;
        }
        // タブバー・ツールボタンでのクリックのみ
        if (e.target.localName != 'tabs' && e.target.localName != 'toolbarbutton') {
            return;
        }
        undoCloseTab(0);
        e.preventDefault();
        e.stopPropagation();
    }
    // 新規タブ追加ボタン
    document.getElementById('new-tab-button').onclick = ucjsUndoCloseTab;
    // タブバー
    gBrowser.tabContainer.addEventListener('click', ucjsUndoCloseTab, true);
    window.addEventListener('unload', function uninit() {
        gBrowser.tabContainer.removeEventListener('click', ucjsUndoCloseTab, true);
        window.removeEventListener('unload', uninit, false);
    }, false);
})();
