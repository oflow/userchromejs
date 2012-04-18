// ==UserScript==
// @name           auto reset searchbar
// @description    Web検索したらキーワードをクリアして一番上の検索エンジンに戻す
// @version        1.0
// @author         oflow
// @compatibility  Firefox 4.0, 11.0
// @namespace      http://oflow.me/archives/337
// ==/UserScript==

(function() {
    // handleSearchCommandにちょっと付け足す
    var func = BrowserSearch.searchBar.handleSearchCommand.toString()
                   .replace(/^\s*function.+{/, '').replace(/}\s*$/, '');
    
    var code = 'textBox.value="";
             + 'var searchbar = BrowserSearch.searchBar;'
             + 'searchbar.currentEngine = searchbar.engines[0];';

    // クリアするのにちょっとだけ時間おく
    code = 'setTimeout(function(){' + code + '},2000);'

    func += code;
    BrowserSearch.searchBar.handleSearchCommand = new Function('aEvent', func);
})();
