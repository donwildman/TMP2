M.TabLayout = M.CardLayout.extend({

    type: 'M.TabLayout',

    setView: function( view ) {

        var html = view.render();
        $('.layout-container .tab-layout-a').html(html);
    }

});
