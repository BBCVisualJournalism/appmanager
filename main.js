define([
    'bootstrap',
    'istats-1'
], function (news, istats) {

    var getQueryStringValue = function (queryString, param) {
        var reg = new RegExp('[?&]' + param + '=([^&#]*)', 'i'),
            string = reg.exec(queryString);

        return string ? string[1] : null;
    };

    var hitEndpoint = function (url) {
        window.location.href = url;
    };

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
    (function () {
        if (window.location.href.split('onbbcdomain=')[1] === 'true') {
            document.documentElement.className += ' onbbcdomain';
        }
        var hostId = window.location.href.match(/hostid=(.*)&/);
        if (hostId && hostId.length) {
            window.istatsTrackingUrl += '&iframe_host=' + encodeURI(hostId[1]);
        }
    })();
    document.write('<' + 'p style="position: absolute; top: -999em;"><' + 'img src="' + window.istatsTrackingUrl + '" height="1" width="1" alt="" /><' + '/p>');

    news.$.on('istats', function (actionType, actionName, viewLabel) {
        istats.log(actionType, actionName, {'view': viewLabel});
    });

    news.$.on('pageLoaded', function () {
        hitEndpoint('bbcnewsapp://visualjournalism/pageloaded');
    });

    news.$.on('app-share', function (appMessage) {
        hitEndpoint('bbcnewsapp://visualjournalism/share?title=' + appMessage.title + '&text=' + appMessage.text, 'appShare');
    });
});
