APP1.app = M.Application.design({

    defaultTemplate: M.TemplateOnePage,

    events: {
        applicationDidLoad: {
            target: APP1.ApplicationController,
            action: 'initApplication'
        }
    },

    fragments: {
        page1: 'fragment1.js',
        page2: 'fragment2.js'
    }

});