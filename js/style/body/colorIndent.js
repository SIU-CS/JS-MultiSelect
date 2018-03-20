define(['require', 'jquery', 'utility/color', 'utility/nestedDepth'], function(require) {
    'use strict';

    var $, jquery;
    jquery = $ = require('jquery');
    var colorUtil = require('utility/color');
    var nestedDepth = require('utility/nestedDepth');

    // sets the color for all list groups
    function setColorRecursivly($ele, colorArray, colorI) {
        // for each child element
        $ele.children(".list-group").each(function (i, e) {
            var $e = $(e);
            // sets the background color
            $e.css("background-color", colorUtil.RgbArrayToString(colorArray[colorI]));
            // chacks the background color and changes text color for high constrast
            if (colorUtil.GetBrightness(colorArray[colorI]) < 0.5)
            {
                $e.addClass("textColorLighter");
            }else {
                $e.addClass("textColorDarker");
            }
            // finds children
            setColorRecursivly($e, colorArray, colorI + 1);
        });
    }

    $().ready(function() {
        $(".list-group-root > .list-group").each(function(i, e) {
            var $ele = $(e);
            var color = $ele.css("background-color");
            var rgbA = colorUtil.RgbStringToArray(color);
            var maxDepth = nestedDepth($ele, ".list-group");
            var fadeArray = colorUtil.fadeRgbToWhite(rgbA[0], rgbA[1], rgbA[2], maxDepth);
            $ele.css("background-color", colorUtil.RgbArrayToString(fadeArray[0]));
            setColorRecursivly($ele, fadeArray, 1);
        });
    });
});
