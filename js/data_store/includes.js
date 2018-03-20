define(function (require) {
    'use strict';
    require('data_store/cache');
    return {
        'get': require('data_store/get'),
        'item.select': require('data_store/set'),
        'search': require('data_store/new')
    };
});