// ==UserScript==
// @name           Search Engine middle-click "Select and Paste and Search"
// @description    検索エンジンメニューのミドルクリックで検索エンジンを切り替えてから貼り付けて検索
// @version        1.2
// @include        main
// @compatibility  Firefox ESR31.3
// @author         oflow
// @namespace      http://oflow.me/archives/1327
// ==/UserScript==

(function() {
    var ucjsSearchEngineMiddleClickSearch = {
        searchbar: BrowserSearch.searchBar,
        init: function() {
            if (!this.searchbar) {
                return;
            }
            this.searchbar.addEventListener('click', this, false);
            window.addEventListener('unload', this, false);
        },
        uninit: function() {
            this.searchbar.removeEventListener('click', this, false);
            window.removeEventListener('unload', this, false);
        },
        handleEvent: function(e) {
            switch (e.type) {
                case 'click':
                    var target = e.originalTarget;
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
                case 'unload':
                    this.uninit();
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
                engines   = searchbar._engines || searchbar.engines;

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
