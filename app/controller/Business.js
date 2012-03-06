/*
 * File: app/controller/Business.js
 *
 * This file was generated by Sencha Designer version 2.0.0.
 * http://www.sencha.com/products/designer/
 *
 * This file requires use of the Sencha Touch 2.0.x library, under independent license.
 * License of Sencha Designer does not include license for Sencha Touch 2.0.x. For more
 * details see http://www.sencha.com/license or contact license@sencha.com.
 *
 * This file will be auto-generated each and everytime you save your project.
 *
 * Do NOT hand edit this file.
 */

Ext.define('CityBars.controller.Business', {
    extend: 'Ext.app.Controller',

    config: {
        refs: {
            dataList: '#dataList',
            listCard: '#listCard',
            mainNav: 'mainnav',
            detailCard: '#detailCard'
        },

        control: {
            "#dataList": {
                itemtap: 'onListItemTap'
            }
        }
    },

    launch: function() {
        var me = this;

        Ext.Viewport.setMasked({ message: 'Loading...' });

        // get the location, then...
        me.getLocation(function (location) {

            // then use Yelp to get the businesses
            me.getBusinesses(location, function (store) {

                // then bind data to list and show it
                me.getDataList().setStore(store);

                Ext.Viewport.setMasked(false);
            });
        });
    },

    onListItemTap: function(dataview, index, target, record, e, options) {
        var me = this,
            map,
            lat,
            long,
            loc,
            marker,
            info;

        if (record) {

            if (!me.details) {
                me.details = Ext.create('CityBars.view.DetailPanel', {
                    title: 'Details'
                });
            }

            // set the map
            map = me.details.child('#detailMap');
            lat = record.get('latitude');
            long = record.get('longitude');

            map.setMapOptions({
                zoom: 3
            });
            map.setMapCenter({
                latitude: lat,
                longitude: long
            });
            map.getMap().setZoom(22);

            // set the info
            info = me.details.child('#contact').child('#info');
            info.child('#photo').setData(record.data);
            info.child('#data').setData(record.data);

            me.getMainNav().push(me.details);
        }
    },

    getLocation: function(callback) {
        console.log('getLoc');
        if (navigator && navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function(position) {
                callback(position);
            }, function(error) {
                // give a warning for error
            });
        }
    },

    getBusinesses: function(location, callback) {
        // NOTE ABOUT YELP KEY
        // You must use your own yelp key, available by registering (for free) with Yelp:
        // http://www.yelp.com/developers/getting_started/api_overview
        // (in this app, we use the Review Search API v1.0)
        console.log('getBiz');
        var store = Ext.data.StoreManager.lookup('BusinessStore'),
            url = 'http://api.yelp.com/business_review_search' +
            '?ywsid=rtGTuop7SdSQwCJwXr90Qw' +
            '&term=Bars' +
            '&lat=' + location.coords.latitude +
            '&long=' + location.coords.longitude;

        store.getProxy().setUrl(url);

        store.load(function() {
            callback(store);
        });
    }

});