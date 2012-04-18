// ==UserScript==
// @name           middle-click "Undo Close Tab"
// @description    タブバー上のミドルクリックで閉じたタブを元に戻すだけ
// @version        1.0
// @author         oflow
// @compatibility  Firefox 4.0, 11.0
// @namespace      http://oflow.me/
// @note           Firefox 11.0 で動作確認
// @note           mTabContainerの外にある新規タブ追加ボタンのミドルクリックでも戻す
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
    gBrowser.mTabContainer.addEventListener('click', ucjsUndoCloseTab, true);

    window.addEventListener('unload', function() {
        gBrowser.mTabContainer.removeEventListener('click', ucjsUndoCloseTab, true);
        window.removeEventListener('unload', arguments.callee, false);
    }, false);
})();
