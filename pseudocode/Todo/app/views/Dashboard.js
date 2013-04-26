Todo.Dashboard = M.View.design({

    childViews: 'label',

    label: M.LabelView.design({
        cssClass: 'lol lol1',
        events: {
            preRender: function() {
                console.log('preRender');
            }
        }
    })
});