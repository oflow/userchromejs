// ==UserScript==
// @name           Focus Last Tab
// @namespace      http://oflow.me/archives/1269
// @description    タブを閉じたときに直前に開いてたタブにフォーカス
// @compatibility  Firefox ESR 31, 34.0.5
// @author         oflow
// @version        1.3.1
// ==/UserScript==

(function() {
    // Session store APIを使ってタブにタイムスタンプ・未読を保存する
    const Cc = Components.classes;
    const Ci = Components.interfaces;
    var ss = Cc["@mozilla.org/browser/sessionstore;1"].getService(Ci.nsISessionStore);

    var ucjsFocusLastTab = {
        handleEvent: function(e) {
            var tab = e.target;
            switch (e.type) {
                case 'TabOpen':
                    this.open(tab);
                    break;
                case 'TabClose':
                    this.close(tab);
                    break;
                case 'TabSelect':
                    this.select(tab);
                    break;
            }
        },
        close: function(tab) {
            var tabs   = tab.parentNode.childNodes,
                index  = 0,
                lastTimestamp = 0,
                hasUnread     = false;

            for (var i = 0; i < tabs.length; i++) {
                var timestamp = ss.getTabValue(tabs[i], 'data-flt-timestamp'),
                    unread    = ss.getTabValue(tabs[i], 'data-flt-unread');

                if (tabs[i] == tab || !timestamp) {
                    continue;
                }
                if (unread) {
                    // 未読ならとりあえずそれにフォーカス
                    if (!hasUnread || !lastTimestamp) {
                        index = i;
                        lastTimestamp = timestamp;
                        hasUnread     = true;
                        continue;
                    }
                    // 未読がたまってる場合は未読タブを古い順に開いていく(逆順)
                    if (timestamp < lastTimestamp) {
                        index = i;
                        lastTimestamp = timestamp;
                    }
                } else if (!hasUnread) {
                    // 未読がない場合は直前のタブにフォーカス
                    if (timestamp > lastTimestamp) {
                        index = i;
                        lastTimestamp = timestamp;
                    }
                }
            }
            if (lastTimestamp) {
                // 開くタブが未読だったら値を消す
                if (hasUnread) {
                    ss.deleteTabValue(tabs[index], 'data-flt-unread');
                }
                gBrowser.selectedTab = tabs[index];
            }
        },
        select: function(tab) {
            // 選択したらタイムスタンプ更新して未読消す
            ss.setTabValue(tab, 'data-flt-timestamp', Date.now().toString());
            ss.deleteTabValue(tab, 'data-flt-unread');
        },
        open: function(tab) {
            // タイムスタンプ追加、未読追加
            ss.setTabValue(tab, 'data-flt-timestamp', Date.now().toString());
            ss.setTabValue(tab, 'data-flt-unread', 'true');
        },
        init: function() {
            // loadInBackground trueにしてるのでTabOpenも入れとく
            gBrowser.tabContainer.addEventListener('TabClose', this, false);
            gBrowser.tabContainer.addEventListener('TabSelect', this, false);
            gBrowser.tabContainer.addEventListener('TabOpen', this, false);
            window.addEventListener('beforeunload', function() {
                gBrowser.tabContainer.removeEventListener('TabClose', this, false);
                gBrowser.tabContainer.removeEventListener('TabSelect', this, false);
                gBrowser.tabContainer.removeEventListener('TabOpen', this, false);
                window.removeEventListener('beforeunload', arguments.callee, false);
            }, false);
        }
    };

    ucjsFocusLastTab.init();
})();
