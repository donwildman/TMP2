MyApp.ApplicationController = M.Controller.extend({

    initApplication: function() {
        this.setTemplate(M.PageOneTemplate);
        this.setContent(MyApp.StartScreen);
    }

});

MyApp.StartScreen = M.Container.design({

    childViews: 'button',

    events: {

        beforeRender: function() {

        },

        afterRender: function() {

        },

        onShow: function() {

        }
    },

    button: M.ButtonView.design({
        value: 'gotoPage2',

        events: {

            beforeRender: function() {

            },

            afterRender: function() {

            },

            onShow: function() {

            },

            tap: function() {
                M.Application.toggleContent(MyApp.Dashboard, null, M.Application.overlay);
            }
        }
    })
});

MyApp.Dashboard = M.Container.design({

})