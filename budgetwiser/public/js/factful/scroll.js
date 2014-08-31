/*
 * use strict mode
 */
'use stirct';

/*
 * Initialize scroll object
 */
Factful.scroll = {};

Factful.scroll.moveUp = function(commentsGroup){
    var _g = commentsGroup, step = 32;

    _g.move += step;
    $(_g.view_).css('top', '+=' + step);
};
Factful.scroll.moveDown = function(commentsGroup){
    var _g = commentsGroup, step = 32;

    _g.move -= step;
    $(_g.view_).css('top', '-=' + step);
};

Factful.scroll.moveOrig = function(commentsGroup){
    var _g = commentsGroup;

    $(_g.view_).css('top', parseInt($(_g.view_).css('top')) - _g.move);
    _g.move = 0;
};
