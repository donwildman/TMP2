M.Application = M.Object.extend({

    /**
     * This property contains the application-specific configurations. It is automatically set by Espresso
     * during the init process of an application. To access these properties within the application, use the
     * getConfig() method of M.Application.
     */
    config: null,

    /**
     * Called when the framework is ready
     */
    start: function() {
        throw M.Exception.START_NOT_DEFINED.getException();
    },

    /**
     *
     * @param {String} key The key of the configuration value to want to retrieve.
     * @returns {String} The value in the application's config object with the key 'key'.
     */
    getConfig: function(key) {
        if(this.config.hasOwnProperty(key)) {
            return this.config[key];
        }
        return null;
    }

});