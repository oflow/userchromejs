// ==UserScript==
// @name           Search Engine middle-click "Select and Paste and Search"
// @description    検索エンジンメニューのミドルクリックで検索エンジンを切り替えてから貼り付けて検索
// @version        1.0
// @include        main
// @compatibility  Firefox ESR31.3
// @author         oflow
// @namespace      http://oflow.me/
// ==/UserScript==

(function() {
    var ucjsSearchEngineMiddleClickSearch = {
        init: function() {
            var searchbar = BrowserSearch.searchBar;
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
            switch (e.type) {
                case 'click':
                    if (e.button == 1) {
                        if (e.originalTarget.nodeName == 'menuitem') {
                            this.select(e.originalTarget);
                            this.paste();
                            this.doSearch();
                        } else if (e.originalTarget.getAttribute('anonid') == 'searchbar-engine-button') {
                            this.paste();
                            this.doSearch();
                        }
                    }

                    break;
            }
        },
        paste: function() {
            BrowserSearch.searchBar.select();
            goDoCommand('cmd_paste');
        },
        select: function(menuitem) {
            var name = menuitem.label,
                searchbar = BrowserSearch.searchBar;

            for (var i = 0; i < searchbar.engines.length; i++) {
                var engine = searchbar.engines[i];
                if (name == engine.name) {
                    searchbar.currentEngine = searchbar.engines[i];
                    break;
                }
            }
        },
        doSearch: function() {
            BrowserSearch.searchBar.handleSearchCommand();
        }
    };
    ucjsSearchEngineMiddleClickSearch.init();
})();
