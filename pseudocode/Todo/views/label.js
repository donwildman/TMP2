M.LabelView = M.View.extend({
    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.LabelView',

    _generateMarkup: function(){
        return '<div class="m-view" id="' + this._id + '"> ' + this.value + ' </div>';
    }
});