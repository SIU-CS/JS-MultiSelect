define(['require',
        'jquery'
    ], 
function(require, $) {
    'use strict';
    var jquery = $;

    /**
     * Turns the multiselect into a responsize multicolumn select
     * @param {jquery element} $multiselect the targeted multiselect
     * @param {JSON} settings the settings of the target multiselect
     */
    function handler($multiselect, settings) {
        var $jsmBody = $multiselect.find(".JSM-body");
        var $jsmList = $jsmBody.find(".JSM-list");
        var $jsmFirstGroup = $jsmList.children(".list-group");
        var currentNumColumns = -1;

        var maxColumns = settings['numColumns'] = $.isNumeric(settings['numColumns']) ? settings['numColumns'] : 3;
        if (maxColumns <= 0) maxColumns = 3;

        function toggleSpace(numVisibleItems, itemHeight) {
            // adds and removes space as needed to keep the list balanced
            var numCurrSpace = $jsmFirstGroup.children(".JSM-spacer").length;

            var totalNeededSpaces = currentNumColumns - (numVisibleItems % currentNumColumns);
            var neededSpace = totalNeededSpaces % currentNumColumns - numCurrSpace;

            if (neededSpace > 0) {
                for(var i = 0; i < neededSpace; i += 1) {
                    $jsmFirstGroup.append('<div class="JSM-spacer"></div>');
                }
            } else if (neededSpace < 0) {
                var $removal = $jsmFirstGroup.children(".JSM-spacer").slice(0,-neededSpace);
                $removal.animate({
                        height: "0",
                    }, 0,
                    function() {
                        $removal.remove();
                    }
                );
            }
            $jsmFirstGroup.children(".JSM-spacer").animate({
                    height: itemHeight + "px",
                }, 0
            );
        }

        function toggleCSS($selectedItem) {
            var itemHeight = Math.ceil(
                $jsmList.find('.list-group-item:visible').first().outerHeight()
            );
            var numVisItems = $jsmList.find('.list-group-item:visible').length;

            var maxHeight = $jsmBody.css('max-height').replace('px', '');
            var currHeight = itemHeight * numVisItems;

            if (settings['dynamicColumns'] === true || settings['dynamicColumns'] === "true") {
                currentNumColumns = Math.ceil(currHeight/maxHeight);
                if (currentNumColumns > maxColumns) currentNumColumns = maxColumns;
                if (currentNumColumns < 1) currentNumColumns = 1;
            } else {
                currentNumColumns = maxColumns;
            }
            if ($jsmFirstGroup.css('column-count') != currentNumColumns) {
                $jsmFirstGroup.css({
                    '-webkit-column-count': currentNumColumns,
                    'moz-column-count': currentNumColumns,
                    'column-count': currentNumColumns
                });
            }

            $jsmFirstGroup.animate({
                    width: (100/maxColumns * currentNumColumns) + "%",
                }, 200
            );
            toggleSpace(numVisItems, itemHeight);
        }

        $jsmList.on("shown.bs.collapse hidden.bs.collapse", ".list-group.collapse", function(e) {
            toggleCSS($(this));
        });
        toggleCSS();
    }
    
    return handler;
});