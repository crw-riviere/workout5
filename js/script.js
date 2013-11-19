var checkRequest = navigator.mozApps.checkInstalled("http://wo5.riviere.la/wo5.webapp");
checkRequest.onsuccess = function () {
    if (checkRequest.result) {
        // we're installed
    } else {
        // not installed
        var installRequest = navigator.mozApps.install("http://wo5.riviere.la/wo5.webapp");
        request.onsuccess = function () {
            window.alert('Installed Workout5.');
        };
        request.onerror = function () {
            window.alert('Failed to install Workout5.');
        };
    }
};
checkRequest.onerror = function () {
    alert('Error checking installation status: ' + this.error.message);
};