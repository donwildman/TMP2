Todo.Dashboard = M.View.design({

    childViews: 'label label2',

    label: M.BoxView.design({
        cssClass: 'lol lol1',
        childViews: 'label2',
        value: 'DOM UND MARCO',
        events: {
            preRender: function() {
                console.log('preRender');
            }
        },
        label2: M.LabelView.design({
            cssClass: 'lol lol1',
            value: 'DOM UND MARCO',
            events: {
                preRender: function() {
                    console.log('preRender');
                }
            }
        })
    }),
    label2: M.LabelView.design({
        cssClass: 'lol lol1',
        value: 'DOM UND MARCO',
        events: {
            preRender: function() {
                console.log('preRender');
            }
        }
    })
});