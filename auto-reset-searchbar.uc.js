// ==UserScript==
// @name           auto reset searchbar
// @description    Web検索したらキーワードをクリアして一番上の検索エンジンに戻す
// @version        1.2.3
// @include        main
// @compatibility  Firefox ESR31.3, 34.0.5
// @author         oflow
// @namespace      http://oflow.me/archives/337
// ==/UserScript==

(function() {
    // リセットするまでにちょっと時間をおくかどうか [true=タイマー使う, false=即時クリア]
    const ARS_USE_TIMER = true;
    // リセットするまでの時間(ミリ秒) [3000=3秒]
    const ARS_TIMER_MS  = 2000;
    // 検索したら一番上の検索エンジンに戻すかどうか [true=戻す, false=そのまま]
    const ARS_USE_DEFAULT_ENGINE = true;
    // リセットタイマーが動いてるときに検索バーにフォーカスでタイマーを止めるかどうか [true=止める, false=止めない]
    const ARS_USE_FOCUS = false;
    // 検索ボタンクリックでクリアするかどうか [true=クリア, false=そのまま]
    const ARS_USE_CLICK = true;
    // 貼り付けて検索のときにクリアするかどうか [true=クリア]
    const ARS_USE_COMMAND = true;
    // Enterキーで検索のときにクリアするかどうか [true=クリア]
    const ARS_USE_ENTER = true;

    var ucjsAutoResetSearchbar = {
        timer: null,
        init: function() {
            var searchbar = BrowserSearch.searchBar;
            if (ARS_USE_FOCUS) {
                searchbar.addEventListener('focus', this, false);
            }
            if (ARS_USE_CLICK) {
                searchbar.addEventListener('click', this, false);
            }
            if (ARS_USE_COMMAND) {
                searchbar.addEventListener('command', this, false);
            }
            if (ARS_USE_ENTER) {
                searchbar.addEventListener('keypress', this, false);
            }
        },
        handleEvent: function(e) {
            switch (e.type) {
                case 'focus':
                    // タイマーでリセットする前に検索バーにフォーカスしたらリセットしない
                    if (ARS_USE_TIMER && this.timer) {
                        clearTimeout(this.timer);
                        this.timer = null;
                    }
                case 'click':
                    // 検索ボタンクリックしての検索
                    if (e.originalTarget.getAttribute('anonid') == 'search-go-button') {
                        if (e.button === 0 || e.button === 2) {
                            // 左クリック(0) or 中クリック(2)
                            this.reset();
                        }
                    }
                    break;
                case 'command':
                    // 貼り付けて検索
                    if (e.originalTarget.getAttribute('anonid') == 'paste-and-search') {
                        this.reset();
                    }
                    break;
                case 'keypress':
                    // Enterキーで検索
                    if (e.keyCode === 13) {
                        this.reset();
                    }
                    break;
            }
        },
        reset: function() {
            // chrome://browser/content/browser/search/search.xml
            var searchbar = BrowserSearch.searchBar,
                textbox   = searchbar._textbox;

            if (!textbox) {
                return;
            }
            if (ARS_USE_TIMER && this.timer) {
                clearTimeout(this.timer);
                this.timer = null;
            }
            if (ARS_USE_TIMER) {
                this.timer = setTimeout(function() {
                    textbox.value = '';
                    if (ARS_USE_DEFAULT_ENGINE) {
                        searchbar.currentEngine = searchbar.engines[0];
                    }
                }, ARS_TIMER_MS);
            } else {
                textbox.value = '';
                if (ARS_USE_DEFAULT_ENGINE) {
                    searchbar.currentEngine = searchbar.engines[0];
                }
            }
        }
    }
    ucjsAutoResetSearchbar.init();
})();
