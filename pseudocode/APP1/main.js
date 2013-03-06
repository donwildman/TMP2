APP1.app = M.Application.design({

    defaultTemplate: M.TemplateOnePage,

    events: {
        applicationDidLoad: {
            target: APP1.ApplicationController,
            action: 'initApplication'
        }
    }

});