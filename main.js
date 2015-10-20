define([
    'bootstrap',
    'istats'
], function (news, istats) {

    var getQueryStringValue = function (querystring, param) {
        var queryString = querystring,
            regex       = new RegExp('(?:[\\?&]|&amp;)' + name + '=([^&#]*)'),
            results     = regex.exec(queryString);
        return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
    };

    var hashOfThePage = window.location.hash.substr(1);
    var cpsAssetId = getQueryStringValue(hashOfThePage, 'cps_asset_id');
    var pageType = getQueryStringValue(hashOfThePage, 'page_type');
    var countername = getQueryStringValue(hashOfThePage, 'countername');

    window.istats = {
        enabled: true
    }
    window.bbcFlagpoles_istats = "ON";
    window.istatsTrackingUrl = '//sa.bbc.co.uk/bbc/bbc/s?name=' + countername + '&cps_asset_id=' + cpsAssetId + '&page_type=' + pageType;
    (function () {
        if (window.location.href.split('onbbcdomain=')[1] == 'true') {
            document.documentElement.className += ' onbbcdomain';
        }
        var hostId = window.location.href.match(/hostid=(.*)&/);
        if (hostId && hostId.length) {
            window.istatsTrackingUrl += "&iframe_host=" + encodeURI(hostId[1]);
        }
    })();
    document.write('<' + 'p style="position: absolute; top: -999em;"><' + 'img src="' + window.istatsTrackingUrl + '" height="1" width="1" alt="" /><' + '/p>');

    news.$.on('istats', function (actionType, actionName, viewLabel) {
        istats.log(actionType, actionName, {'view': viewLabel});
    });

    news.$.on('pageLoaded', function () {
        document.write('<' + 'p style="position: absolute; top: -999em;"><' + 'img src="bbcnewsapp://visualjournalism/pageloaded" height="1" width="1" alt="" /><' + '/p>');
    });

});
