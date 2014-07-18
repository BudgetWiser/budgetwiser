/*
 * use strict mode
 */
'use strict';

/*
 * Article object
 */
Factful.Article = function(model){
    if(!model){
        this._user = model.user;
        this._id = model.id;

        this.title = model.title;
        this.subtitle = model.subtitle;
        this.date = model.date;
        this.url = model.url;
        this.press = model.press;

        this.paragraphs = [];
    }
};

/*
 * Generate Article DOMobjects
 */
Factful.Article.prototype.generateView = function(container){
    if(!container){
    }
};
