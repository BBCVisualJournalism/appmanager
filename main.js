define(['istats-1'], function (istats) {

    var pageHasLoaded = false;

    var getQueryStringValue = function (queryString, param) {
        var reg = new RegExp('[?&]' + param + '=([^&#]*)', 'i'),
            string = reg.exec(queryString);

        return string ? string[1] : null;
    };

    var hitEndpoint = function (url) {
        // Check if we're running under cucumber
        if (!navigator.userAgent.match(/^ *cucumber *$/i)) {
            window.location = url;
        } else {
            window.locations_visited = window.locations_visited || [];
            window.locations_visited.push(url);
        }
    };

    var trackPageLoad = function () {
        var trackingContainer = document.createElement('p');
        trackingContainer.style.position = 'absolute';
        trackingContainer.style.top = '-999em';
        trackingContainer.innerHTML = '<img src="' + window.istatsTrackingUrl + '" height="1" width="1" alt="" />';

        document.body.appendChild(trackingContainer);
    };

    var setupIstats = function () {
        var hashOfThePage = window.location.hash.substr(1),
            cpsAssetId = getQueryStringValue(hashOfThePage, 'cps_asset_id'),
            pageType = getQueryStringValue(hashOfThePage, 'page_type'),
            countername = getQueryStringValue(hashOfThePage, 'countername');

        window.istats = {
            enabled: true
        };
        window.orb = {};
        window.bbcFlagpoles_istats = 'ON';
        window.istatsTrackingUrl = '//sa.bbc.co.uk/bbc/bbc/s?name=' + countername + '&cps_asset_id=' + cpsAssetId + '&page_type=' + pageType;
    };

    var setupPubsubListeners = function (callback) {
        if (require.specified('bootstrap') || require.defined('bootstrap')) {
            require(['bootstrap'], function (news) {
                news.pubsub.on('istats', exports.istats);
                news.pubsub.on('pageLoaded', exports.pageLoaded);
                news.pubsub.on('app-share', exports.appShare);
                callback();
            });
        } else {
            callback();
        }
    };

    var exports = {
        init: function (callback) {
            setupIstats();
            setupPubsubListeners(callback);
        },
        istats: function (actionType, actionName, viewLabel) {
            istats.log(actionType, actionName, {'view': viewLabel});
        },
        pageLoaded: function () {
            if (!pageHasLoaded) {
                hitEndpoint('bbcnewsapp://visualjournalism/pageloaded');
                trackPageLoad();
                pageHasLoaded = true;
            }
        },
        appShare: function (appMessage) {
            hitEndpoint('bbcnewsapp://visualjournalism/share?title=' + appMessage.title + '&text=' + appMessage.text, 'appShare');
        }
    }

    return exports;
});
