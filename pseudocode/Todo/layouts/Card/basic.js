M.CardLayout = M.Layout.extend({

    type: 'M.CardLayout',

    basicMarkup: function() {
        return '<div class="layout-container">' + '<div class="layout-a"></div>' + '<div class="layout-b"></div>' + '</div>';
    },

    setView: function( view ) {

        var html = view.render();
        $('.layout-container .layout-a').html(html);
    }

});
