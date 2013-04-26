M.LabelView = M.View.extend({
    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.LabelView',

    _generateMarkup: function(){
        return this.value;
    }
});