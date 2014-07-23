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
Factful.Article.prototype.generateView = function(articleView){
    this.view_ = articleView;
    this.view_.addClass('factful-article');

    var _title_view = Factful.createElement('h2', {
        'class': 'factful-article-title'
    });
    this.view_.appendChild(_title_view);
};
