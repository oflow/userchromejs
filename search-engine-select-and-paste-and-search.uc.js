// ==UserScript==
// @name           Search Engine middle-click "Select and Paste and Search"
// @description    検索エンジンメニューのミドルクリックで検索エンジンを切り替えてから貼り付けて検索
// @version        1.1
// @include        main
// @compatibility  Firefox ESR31.3
// @author         oflow
// @namespace      http://oflow.me/archives/1327
// ==/UserScript==

(function() {
    var ucjsSearchEngineMiddleClickSearch = {
        searchbar: BrowserSearch.searchBar,
        init: function() {
            var searchbar = this.searchbar;
            if (!searchbar) {
                return;
            }
            searchbar.addEventListener('click', this, false);
            window.addEventListener('beforeunload', function() {
                searchbar.removeEventListener('click', this, false);
                window.removeEventListener('beforeunload', arguments.callee, false);
            }, false);
        },
        handleEvent: function(e) {
            var target = e.originalTarget;
            switch (e.type) {
                case 'click':
                    if (e.button == 1) {
                        if (target.nodeName == 'menuitem') {
                            this.paste();
                            this.select(target);
                            this.doSearch();
                        } else if (target.getAttribute('anonid') == 'searchbar-engine-button') {
                            this.paste();
                            this.doSearch();
                        }
                    }

                    break;
            }
        },
        paste: function() {
            this.searchbar.select();
            goDoCommand('cmd_paste');
        },
        select: function(menuitem) {
            var name      = menuitem.label,
                searchbar = this.searchbar,
                engines   = searchbar.engines;

            for (var i = 0; i < engines.length; i++) {
                if (name == engines[i].name) {
                    searchbar.currentEngine = engines[i];
                    break;
                }
            }
        },
        doSearch: function() {
            this.searchbar.handleSearchCommand();
        }
    };
    ucjsSearchEngineMiddleClickSearch.init();
})();
