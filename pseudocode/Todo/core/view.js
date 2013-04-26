M.View = M.Object.extend(/** @scope M.Object.prototype */{


    /**
     * The type of this object.
     *
     * @type String
     */
    type: 'M.View',

    _dom: null,

    _id: null,

    _isMView: YES,

    events: null,

    cssClass: '',

    value: null,

    design: function( obj ) {
        var view = this.extend(this._normalize(obj));
        view._id = M.ViewManager.getNewId(view);
        return view;
    },

    init: function() {

    },

    render: function() {
        this._preRender();
        this._createDOM();
        this._addId();
        this._addTMPClasses();
        this._bindInternalEvents();
        this._renderChildViews();
        this._style();
        return this.getDOM();
    },

    show: function() {

    },

    getId: function() {
        return this._id;
    },

    getDOM: function() {
        return this._dom;
    },

    getValue: function() {
        this.value = this._getValueFromDOM();
        return this.value;
    },

    _getValueFromDOM: function() {
        return $(this._dom).text();
    },

    setValue: function( value ) {
        this.value = value;
        this._update(this.value);
    },

    _update: function(value) {
        $(this._dom).text(value ? value : this.getValue());
    },

    _renderChildViews: function() {
        _.each(this._childViewsAsArray(), function( childView ) {

            this._appendChildView(this[childView].render())
        }, this);
    },

    _appendChildView: function( childViewDOM ) {
        $(this._dom).append(childViewDOM);
    },

    _childViewsAsArray: function() {
        return this.childViews ? $.trim(this.childViews.replace(/\s+/g, ' ')).split(' ') : [];
    },

    _createDOM: function() {
        if(this._dom) {
            return this._dom;
        }

        var html = '<div>' + this._generateMarkup() + '</div>'
        this._dom = $(html);
    },

    _addId: function() {
        $(this._dom).attr('id', this.getId());
    },

    _generateMarkup: function() {
        return this.value;
    },

    _bindInternalEvents: function() {
        this.on({
            events: {
                click: this._postRender
            }
        });
    },

    _style: function() {
        var that = this;
        $(this._dom).addClass(that.cssClass);
    },

    _addTMPClasses: function() {
        $(this._dom).addClass(Object.getPrototypeOf(this)._getTMPClasses().reverse().join(' '));
    },

    _getTMPClasses: function( cssClasses ) {
        if( !cssClasses ) {
            cssClasses = [];
        }
        cssClasses.push(this._getCssClassByType());
        if( this !== M.View ) {
            Object.getPrototypeOf(this)._getTMPClasses(cssClasses);
        }
        return cssClasses;
    },

    _getCssClassByType: function() {
        return this.type.replace('.', '-').toLowerCase();
    },

    _normalize: function( obj ) {
        obj.events = obj.events || {};
        obj._postRender = obj._postRender || this._postRender;

        return obj;
    },

    _preRender: function() {

        this.handleCallback(this.events.preRender);
    },

    _postRender: function() {
        console.log('I BIN DOOOOO');
        this.handleCallback(this.events.postRender);
    }

});