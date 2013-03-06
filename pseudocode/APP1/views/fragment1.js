APP1.Page1 = M.ContainerView.extend({

   events: {
       load: {
           action: function() {

           }
       },
       preRendering: {
           action: function() {

           }
       },
       postRendering: {
           action: function() {

           }
       },
       show: {
           action: function() {

           }
       }
   },

    childViews: 'label',

    label: M.LabelView.design({

        value: 'HALLO WELT'

    })

});