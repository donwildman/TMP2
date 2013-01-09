(function( window ) {

    M.Bootstrap = M.Bootstrap || {};

    //Get the startPage of the Application from the main.js or config
    M.Bootstrap.startPage = M.Bootstrap.startPage || '';

    //boot up order of framework scripts only for test purposes
    M.Bootstrap.jsList = M.Bootstrap.jsList || [];

    //a list of all pages of an application - esspresso should set this list in order how to load the various page sites of the application
    M.Bootstrap.pageList = [];

    //all loaded scripts - pages and framework scripts
    M.Bootstrap.scriptLoadList = [];

    M.Bootstrap.initialLoad = function() {
        //add the start page to the loading list
        this.jsList.push(M.Bootstrap.startPage);
        this._bootstrap();
    };

    M.Bootstrap._bootstrap = function() {
        var i = this.jsList.shift();
        if( i ) {
            var that = this;
            var js = document.createElement("script");
            js.src = i;
            js.onload = function( data, b, c ) {
                console.log(i + ' DID LOAD');

                console.log(data, b, c);
                that._checkIfBootstrapDone();
                // load next if current loaded
                that._bootstrap();
            };

            document.head.appendChild(js);
        }
    }

    M.Bootstrap._checkIfBootstrapDone = function() {
        //jsList.length === document.scripts.length
        var that = this;
        if( that.jsList.length == 0 ) {
            //trigger event
            console.log('BOOTSTRAPING DONE');

            //async through a flag
            //window.setTimeout doesn't load the files async
            window.setTimeout(function() {
                that.pageList.forEach(function( i ) {
                    that._loadScriptInInitialLoad(i, true);
                });
            }, 0);
        }
    }

    M.Bootstrap._loadScriptInInitialLoad = function( url, async ) {
        var that = this;
        var onload = function() {
            that.scriptLoadList.push(url);
            console.log(url + ' DID LOAD');

            that._checkIfPageLoadDone();
        };
        M.Bootstrap._loadScript(url, async, onload);
    }

    M.Bootstrap.loadScript = function( url, async, onSuccess, onError ) {
        this._loadScript(url, async, onSuccess, onError);
    }

    M.Bootstrap._loadScript = function( url, async, onSuccess, onError ) {
        var that = this;
        var js = document.createElement("script");
        js.src = url;
        js.async = async ? async : false;
        js.onload = onSuccess;
        //TODO THIS WORKS NOT ON MOBILE SAFARI AND CHROME
        js.addEventListener('error', onError, true);
        document.body.appendChild(js);
    }

    M.Bootstrap._checkIfPageLoadDone = function() {
        if( this.pageList.length === this.scriptLoadList.length ) {
            var event;
            if( document.createEvent ) {
                event = document.createEvent("HTMLEvents");
                event.initEvent("applicationdidload", true, true);
            } else {
                event = document.createEventObject();
                event.eventType = "applicationdidload";
            }

            event.eventName = 'applicationdidload';
            event.memo = { };

            if( document.createEvent ) {
                document.dispatchEvent(event);
            } else {
                document.fireEvent("on" + event.eventType, event);
            }
        }
    };

})(window);