'use strict';

define(['require', 'jquery', 'data_store/new'], function(require) {
    var $, jquery;
    jquery = $ = require('jquery');
    var dataStoreNew = require('data_store/new');

    /**
     * A Private function that recurses over the html list and builds the
     * Multiselect data cache
     * @param {Jquery Nodelist} $groupHead The start of the group
     * @return {Object} The multiselect formatted data in JSON object
     */
    function ProcessHTML($groupHead) {
        // return object
        var rv = {};
        // for each child under the head
        $groupHead.children().each(function() {
            var $child = $(this);
            // check is group or just item
            if ($child.children("ul").length > 0) { // is group
                // get the group (only sleect first group)
                var $group = $child.children("ul").first();
                // get the attributes
                var name = $child.attr('name');
                var searchable = $child.attr('searchable') == null ? "" : $child.attr('searchable');
                var selected = $child.attr('selected') == "true";
                // make sure name is defined
                if (typeof name == 'undefined' || name == null) return null;
                // get the children for this node
                var children = ProcessHTML($group);
                // if no children continue
                if (children == null) return null;
                // get the group object
                rv[name] = dataStoreNew.newMultiselectHeader(null, searchable, selected)
                // extend the group ovject with the children elements
                rv[name] = $.extend(children, rv[name]);
                
            } else { // is item
                // get attributes from the element
                var name = $child.attr('name');
                var value = $child.attr('value');
                var searchable = $child.attr('searchable') == null ? "" : $child.attr('searchable');
                var selected = $child.attr('selected') === "true";
                // make sure the important attribute exist
                if (typeof name == 'undefined' || name == null) return null;
                if (typeof value == 'undefined' || value == null) return null;
                // get the new data item and store under given name
                rv[name] = dataStoreNew.newMultiselectItem(value, null, searchable, selected)
            }
        });
        return rv;
    }

    /**
     * This function processes a live nodelist or jquery node list into
     * a data format that can be stored by the multiselect
     * @param {Jquery or HTML nodelist} nodeList data will be extracted from this item
     */
    return function(nodeList) {
        // checks to make sure the list is jquery
        if (!(nodeList instanceof jquery)) {
            nodeList = $(nodeList);
        }
        // clones the list so we don't mess it up
        nodeList = nodeList.clone();

        // processes the html into a correct data format
        return ProcessHTML(nodeList);
    }
});