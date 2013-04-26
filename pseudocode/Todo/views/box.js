M.BoxView = M.View.extend({
    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.BoxView',

    _generateMarkup: function() {
        return '<div><span></span></div>';
    },

    _appendChildView: function(childViewDOM){
        $(this._dom).find('span').append(childViewDOM);
    }
});