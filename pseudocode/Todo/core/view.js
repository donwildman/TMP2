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

    design: function( obj ) {
        var view = this.extend(this._normalize(obj));
        view._id = M.ViewManager.getNewId(view);

        return view;
    },

    init: function() {
        this.callFromSuper('init');
    },

    render: function() {
        this._preRender();
        this._createDOM();
        this._bindInternalEvents();
        this._style();
        return this.getDOM();
    },

    show: function() {

    },

    getId: function(){
        return this._id;
    },

    getDOM: function(){

        return this._dom;
    },

    _createDOM: function(){
        this._dom = $(this._generateMarkup());
    },

    _generateMarkup: function(){
        return '<div style="background: red; height: 10px; width: 10px; display: block;" class="m-view" id="' + this._id + '"><div style="position: absolute; top:0; bottom:0; left: 0; right: 0;"></div></div>';
    },

    _bindInternalEvents: function(){
        this.on({
            events:{
                click: this._postRender
            }
        });
    },

    _style: function(){

        var that = this;
        $(this._dom).addClass(that.cssClass);
    },

    _normalize: function(obj){
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