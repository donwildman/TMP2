window.Todo = M.Application.extend({

    /**
     * @override M.Application.start
     */
    start: function(){

        M.LayoutManager.setLayout(M.CardLayout);
        M.CardLayout.setView(Todo.Dashboard);
        console.log('App Start');
    }
});