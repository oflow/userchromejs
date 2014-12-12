// ==UserScript==
// @name           Focus Last or Unread Tab
// @description    タブを閉じたときに直前に開いてたタブか未読タブにフォーカスしたり
// @version        1.4.5
// @include        main
// @compatibility  Firefox ESR31.3, 34.0.5
// @author         oflow
// @namespace      http://oflow.me/archives/1269
// ==/UserScript==

(function() {
    // ピン留めしたタブも含めるか [true=ピン留めタブもフォーカス, false=ピン留めは無視]
    const FLT_FOCUS_PINNED = true;
    // タブバー上のShift + マウスホイールで順番にタブをフォーカス [true=使う, false=使わない]
    const FLT_USE_SHIFT_WHEEL = true;
    // タブの右クリックメニューに並び替えと未読にするを追加 [true=追加する, false=しない]
    const FLT_USE_CONTEXTMENU = true;
    // 未読タブ用のCSS
    var FLT_UNREAD_CSS = '.tabbrowser-tab[data-flt-unread] .tab-text { }';
    /* 未読CSSサンプル */
    /*
    var FLT_UNREAD_CSS = '.tabbrowser-tab[data-flt-unread] {\
                                padding-top: 0 !important;\
                            }\
                            .tabbrowser-tab[pinned][data-flt-unread] {\
                                padding-top: 1px !important;\
                            }\
                            .tabbrowser-tab[data-flt-unread] .tab-stack {\
                                border-top: 2px solid #e55 !important;\
                                margin-top: -2px !important;\
                                padding-top: 2px !important;\
                            }\
                            .tabbrowser-tab[data-flt-unread] .tab-icon-image,\
                            .tabbrowser-tab[data-flt-unread] .tab-throbber {\
                                margin-top: -1px !important;\
                            }\
                            .tabbrowser-tab[data-flt-unread] .tab-text {\
                                font-weight: normal !important;\
                            }';

    */
    // Session store APIを使ってタブにタイムスタンプ・未読を保存する
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
                    if (!this.scroll) {
                        // ホイールスクロール中にタイムスタンプ更新するとマズい
                        this.select(tab);
                    }
                    this.scroll = false;
                    break;
                case 'DOMMouseScroll':
                    if (e.shiftKey) {
                        this.scroll = true;
                        this.wheel(gBrowser.selectedTab, e.detail);
                        e.stopPropagation();
                    }
                    break;
                case 'SSTabRestoring':
                    this.restore();
                    break;
            }
        },
        _sort: function(tabs) {
            if (!tab || !tabs.length) {
                return [];
            }
            tabs.sort(function(a, b) {
                if (a.timestamp < b.timestamp) {
                    return -1;
                } else if (a.timestamp > b.timestamp) {
                    return 1;
                } else {
                    return 0;
                }
            });
            return tabs;
        },
        restore: function() {
            // 復元時に未読属性がついてないのをなんとかする
            var tabs      = gBrowser.tabs,
                tabsLen   = tabs.length;

            for (var i = 0; i < tabsLen; i++) {
                var unread = ss.getTabValue(tabs[i], 'data-flt-unread');
                if (unread) {
                    this.markAsUnread(tabs[i]);
                }
            }
        },
        sort: function() {
            var tabs      = gBrowser.tabs,
                tabsLen   = tabs.length,
                container = [],
                pinnedTab  = 0;

            for (var i = 0; i < tabsLen; i++) {
                var timestamp = ss.getTabValue(tabs[i], 'data-flt-timestamp');
                if (tabs[i].pinned) {
                    pinnedTab++;
                } else {
                    container.push({'timestamp': timestamp, 'tab': tabs[i]});
                }
            }
            this._sort(container).reverse().forEach(function(sortedTabs) {
                gBrowser.moveTabTo(sortedTabs.tab, pinnedTab);
            });
        },
        wheel: function(selectedTab, detail) {
            var tabs      = selectedTab.parentNode.childNodes,
                tabsLen   = tabs.length,
                container = [],
                selectedTimestamp = ss.getTabValue(selectedTab, 'data-flt-timestamp');

            for (var i = 0; i < tabsLen; i++) {
                var timestamp = ss.getTabValue(tabs[i], 'data-flt-timestamp');

                if (tabs[i] == selectedTab || !timestamp) {
                    continue;
                }
                if (detail > 0) {
                    // ↓スクロールで1つ戻る
                    if (selectedTimestamp < timestamp) {
                        continue;
                    }
                } else if (detail < 0) {
                    // ↑スクロールで1つ進む
                    if (selectedTimestamp > timestamp) {
                        continue;
                    }
                }
                container.push({'timestamp': timestamp, 'tab': tabs[i]});

            }
            if (container.length) {
                var index = (detail > 0 ? container.length - 1 : 0);
                gBrowser.selectedTab = this._sort(container)[index].tab;
            }
        },
        close: function(tab) {
            var tabs      = tab.parentNode.childNodes,
                tabsLen   = tabs.length,
                container = [],
                hasUnread     = false;

            for (var i = 0; i < tabsLen; i++) {
                var timestamp = ss.getTabValue(tabs[i], 'data-flt-timestamp'),
                    unread    = ss.getTabValue(tabs[i], 'data-flt-unread');

                if (!FLT_FOCUS_PINNED && tabs[i].pinned) {
                    continue;
                }
                if (tabs[i] == tab || !timestamp) {
                    continue;
                }
                if (unread) {
                    if (!hasUnread) {
                        container = [];
                    }
                    hasUnread = true;
                    container.push({'timestamp': timestamp, 'tab': tabs[i]});
                } else if (!hasUnread) {
                    container.push({'timestamp': timestamp, 'tab': tabs[i]});
                }
            }
            if (container.length) {
                var index       = (hasUnread ? 0 : container.length - 1),
                    selectedTab = this._sort(container)[index].tab;

                if (hasUnread) {
                    this.markAsRead(selectedTab);
                }
                gBrowser.selectedTab = selectedTab;
            }
        },
        select: function(tab) {
            // 選択したらタイムスタンプ更新して未読消す
            ss.setTabValue(tab, 'data-flt-timestamp', Date.now().toString());
            this.markAsRead(tab);
            this.debug('select');
        },
        open: function(tab) {
            // タイムスタンプ追加、未読追加
            ss.setTabValue(tab, 'data-flt-timestamp', Date.now().toString());
            this.markAsUnread(tab);
        },
        markAsUnread: function(tab) {
            tab.setAttribute('data-flt-unread', 'true');
            ss.setTabValue(tab, 'data-flt-unread', 'true');
        },
        markAsRead: function(tab) {
            tab.removeAttribute('data-flt-unread');
            ss.deleteTabValue(tab, 'data-flt-unread');
        },
        createMenu: function() {
            var tabContextMenu   = document.getElementById('tabContextMenu'),
                insertBeforeMenu = document.getElementById('context_reloadAllTabs');

            var menuitem = document.createElement('menuitem');
            menuitem.setAttribute('id', 'ucjs_flt_sort_by_timestamp');
            menuitem.setAttribute('label', decodeURIComponent(escape('タブを並び替える(FLT)')));
            menuitem.addEventListener('command', function() { ucjsFocusLastTab.sort(); }, false);
            tabContextMenu.insertBefore(menuitem, insertBeforeMenu);
            var menuitem = document.createElement('menuitem');
            menuitem.setAttribute('id', 'ucjs_flt_mark_as_unread');
            menuitem.setAttribute('label', decodeURIComponent(escape('タブを未読にする(FLT)')));
            menuitem.addEventListener('command', function() { ucjsFocusLastTab.markAsUnread(document.popupNode); }, false);
            tabContextMenu.insertBefore(menuitem, insertBeforeMenu);
        },
        init: function() {
            if (FLT_USE_CONTEXTMENU) {
                this.createMenu();
            }
            // loadInBackground trueにしてるのでTabOpenも入れとく
            gBrowser.tabContainer.addEventListener('TabClose', this, false);
            gBrowser.tabContainer.addEventListener('TabSelect', this, false);
            gBrowser.tabContainer.addEventListener('TabOpen', this, false);
            if (FLT_USE_SHIFT_WHEEL) {
                gBrowser.tabContainer.addEventListener('DOMMouseScroll', this, true);
            }
            window.addEventListener('beforeunload', function() {
                gBrowser.tabContainer.removeEventListener('TabClose', this, false);
                gBrowser.tabContainer.removeEventListener('TabSelect', this, false);
                gBrowser.tabContainer.removeEventListener('TabOpen', this, false);
                if (FLT_USE_SHIFT_WHEEL) {
                    gBrowser.tabContainer.removeEventListener('DOMMouseScroll', this, true);
                }
                window.removeEventListener('beforeunload', arguments.callee, false);
            }, false);

            if (FLT_UNREAD_CSS) {
                var style = document.createProcessingInstruction('xml-stylesheet','type="text/css" href="data:text/css,'+ encodeURIComponent(FLT_UNREAD_CSS) +'"');
                style.id = 'ucjs-flt-style';
                document.insertBefore(style, document.documentElement);
            }
            // セッション復元時に未読属性を戻す
            document.addEventListener('SSTabRestoring', this, false);
        }
    };

    ucjsFocusLastTab.init();
})();
