define(['require', 'jquery', 'data_store/get', 'utility/showHideItems'],
    function (require, $, getData, showHideItems) {
    'use strict';

    var jquery = $;



    // This is not my code, I used someone else's fuzzy searching algorithm, all credit goes to him
    // The source is https://github.com/mattyork/fuzzy/blob/master/lib/fuzzy.js

    var root = {};

    var fuzzy = {};

    // Use in node or in browser
    root.fuzzy = fuzzy;

    // Return all elements of `array` that have a fuzzy
    // match against `pattern`.
    fuzzy.simpleFilter = function (pattern, array) {
        return array.filter(function (str) {
            return fuzzy.test(pattern, str);
        });
    };

    // Does `pattern` fuzzy match `str`?
    fuzzy.test = function (pattern, str) {
        return fuzzy.match(pattern, str) !== null;
    };

    // If `pattern` matches `str`, wrap each matching character
    // in `opts.pre` and `opts.post`. If no match, return null
    fuzzy.match = function (pattern, str, opts) {
        opts = opts || {};
        var patternIdx = 0,
            result = [],
            len = str.length,
            totalScore = 0,
            currScore = 0,
            // prefix
            pre = opts.pre || '',
            // suffix
            post = opts.post || '',
            // String to compare against. This might be a lowercase version of the
            // raw string
            compareString = opts.caseSensitive && str || str.toString().toLowerCase(),
            ch;

        pattern = opts.caseSensitive && pattern || pattern.toLowerCase();

        // For each character in the string, either add it to the result
        // or wrap in template if it's the next string in the pattern
        for (var idx = 0; idx < len; idx += 1) {
            ch = str[idx];
            if (compareString[idx] === pattern[patternIdx]) {
                ch = pre + ch + post;
                patternIdx += 1;

                // consecutive characters should increase the score more than linearly
                currScore += 1 + currScore;
            } else {
                currScore = 0;
            }
            totalScore += currScore;
            result[result.length] = ch;
        }

        // return rendered string if we have a match for every char
        if (patternIdx === pattern.length) {
            // if the string is an exact match with pattern, totalScore should be maxed
            totalScore = compareString === pattern ? Infinity : totalScore;
            return { rendered: result.join(''), score: totalScore };
        }

        return null;
    };

    // The normal entry point. Filters `arr` for matches against `pattern`.
    // It returns an array with matching values of the type:
    //
    //     [{
    //         string:   '<b>lah' // The rendered string
    //       , index:    2        // The index of the element in `arr`
    //       , original: 'blah'   // The original element in `arr`
    //     }]
    //
    // `opts` is an optional argument bag. Details:
    //
    //    opts = {
    //        // string to put before a matching character
    //        pre:     '<b>'
    //
    //        // string to put after matching character
    //      , post:    '</b>'
    //
    //        // Optional function. Input is an entry in the given arr`,
    //        // output should be the string to test `pattern` against.
    //        // In this example, if `arr = [{crying: 'koala'}]` we would return
    //        // 'koala'.
    //      , extract: function(arg) { return arg.crying; }
    //    }
    fuzzy.filter = function (pattern, arr, opts) {
        if (!arr || arr.length === 0) {
            return [];
        }
        if (typeof pattern !== 'string') {
            return arr;
        }
        opts = opts || {};
        return arr
            .reduce(function (prev, element, idx, arr) {
                var str = element;
                if (opts.extract) {
                    str = opts.extract(element);
                }
                var rendered = fuzzy.match(pattern, str, opts);
                if (rendered !== null) {
                    prev[prev.length] = {
                        string: rendered.rendered,
                        score: rendered.score,
                        index: idx,
                        original: element
                    };
                }
                return prev;
            }, [])

            // Sort by score. Browsers are inconsistent wrt stable/unstable
            // sorting, so force stable by using the index in the case of tie.
            // See http://ofb.net/~sethml/is-sort-stable.html
            .sort(function (a, b) {
                var compare = b.score - a.score;
                if (compare) return compare;
                return a.index - b.index;
            });
    };

    var fuzzySearch = function (data, str, isCaseSensitive) {
        var returnVisible = false;
        for (var i in data) {
            if (data[i] != null) {
                var item = data[i];

                var name = item['@name'];
                var searchable = item['@searchable'];
                if (!isCaseSensitive) {
                    name = name.toLowerCase();
                    searchable = searchable.toLowerCase();
                }


                // if input is not empty, and the input matches an entry in the multiselect, show the item and its children
                if (!str.trim() || fuzzy.match(str, name, null) || fuzzy.match(str, searchable, null)) {
                    showHideItems.showItem(item);
                    showHideItems.showAllChildren(item);
                    returnVisible = true;
                } else {
                    if (item['@isHeader']) {
                        var isAnyVisible = fuzzySearch(item['@children'], str, isCaseSensitive);
                        if (isAnyVisible) {
                            returnVisible = true;
                            showHideItems.showItem(item);
                        } else {
                            showHideItems.hideItem(item);
                        }
                    } else {
                        showHideItems.hideItem(item);
                    }
                }
            }
        }
        return returnVisible;
    };

        return function (multiName, $ele, settings) {
            var isCaseSensitive = settings.caseSensitive === true || settings.caseSensitive === "true";
            var timeout;
            $ele.find(".JSM-head .JSM-searchbar").on("keyup", function () {
                window.clearTimeout(timeout);
                timeout = window.setTimeout(function () {
                    var data = getData.getDataByName(multiName);
                    var str = $('.JSM-searchbar').val();
                    if (!isCaseSensitive)
                        str = str.toLowerCase();
                    fuzzySearch(data, str, isCaseSensitive);
                }, 500);

            });
        };
});
