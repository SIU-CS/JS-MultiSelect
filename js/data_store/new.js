// defines the consructors for the data object
define(['require',
    'data_store/cache',
    'data_store/set',
    'jquery'],
function (require) {
    'use strict';

    var jquery, $;
    jquery = $ = require('jquery');
    var cache = require('data_store/cache');
    var cacheSet = require('data_store/set');

    /**
     * Sets a new multiselect in the cache with these fields
     * @param {A Jquery or Plain HTML node} ele the element referencing the multiselect
     * @param {Object} data The inital data for the multiselect
     * @param {Object} options The inital options for the multiselect
     * @param {String} title The title (not name) for the multiselect
     * @returns {String} The name you can reference the multiselect by
     */
    function newMultiselect(ele, data, options, title) {
        var name = $(ele).attr('name');
        if (typeof name === 'undefined' || name == null) return null;
        if (data == null) data = [];

        var jqueryEle = $(ele).first();
        if (!cache.addMultiselect(name, jqueryEle, data, options, title)) return null;
        return name;
    }
    /**
     * Builds a new multiselect item so we don't miss any fields
     * @param {String} name the name of the item in the multiselect
     * @param {*} value the value to be placed into the multiselect
     * @param {Jquery Element} element The element reference to this item
     * @param {String} searchable The searchable text for this item
     * @param {Bool} selected A bool specifing if the item is pre-selected
     * @param {String} imagePath The path to the image to be displayed with this element
     */
    function newMultiselectItem(name, value, element, searchable, selected, imagePath, iconClass) {
        if (!(element instanceof jquery) && element != null) {
            element = $(element);
        }
        if (element != null && element.length <= 0 ) return null;

        if (value == null || value === "") return null;
        return {
            "@name": name,
            "@value": value,
            "@element": element,
            "@searchable": (searchable == null ? "": searchable),
            "@selected": (selected == null ? false : selected),
            "@isHeader": false,
            "@image": imagePath,
            "@icon": iconClass
        };
    }

    /**
     * Builds a new multiselect header item so we don't miss any fields
     * @param {String} name the name of the header in the multiselect
     * @param {Array} children an array of objects that are the children for this item
     * @param {Jquery Element} element The element reference to this item
     * @param {String} searchable The searchable text for this item
     * @param {Bool} selected A bool specifing if the item is pre-selected
     * @param {String} imagePath The path to the image to be displayed with this element
     * @param {String} iconClass The classes to be attached to the icon tag if no image exists
     */
    function newMultiselectHeader(name, children, element, searchable, selected, imagePath, iconClass) {
        if (!(element instanceof jquery) && element != null) {
            element = $(element);
        }
        if (element != null && element.length <= 0 ) return null;
        if (!$.isArray(children) || children.length <= 0) return null;
        
        return {
            "@name": name,
            "@element": element,
            "@searchable": (searchable == null ? "": searchable),
            "@selected": (selected == null ? false : selected),
            "@isHeader": true,
            "@image": (imagePath == null ? "": imagePath),
            "@icon": (iconClass == null ? "": iconClass),
            "@children": children
        };
    }

    return {
        newMultiselect: newMultiselect,
        newMultiselectHeader: newMultiselectHeader,
        newMultiselectItem: newMultiselectItem
    };
});