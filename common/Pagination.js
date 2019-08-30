var config = require('../config');

exports.get = function(str, page, pagesize, recordcount){
    var list = [];
    var listpage = {};
    var max_show_pagesize = 10;
    var pagecount = Math.ceil(recordcount / pagesize);
    for(var i = 1; i <= pagecount; i++){
    	if((i <= page && i > page - max_show_pagesize/2) || (i > page && i < page + max_show_pagesize /2)){
    		list.push({page : i , url : formatURL(str, i)});
    		listpage[i]  = 1;
    	}
    }
    var p = {
          currentpage : page,
          pagesize : config.page_size,
          recordcount : recordcount,
          pagecount : pagecount,
          item : list
    };

    if(page < pagecount){
    	p.next = formatURL(str, page+1 > pagecount  ? page : page+1);
    	if(!listpage[pagecount])
    		p.last = {index : pagecount , url : formatURL(str, pagecount)};
    }

    if(page > 1){
    	p.prev = formatURL(str, page-1 > 0 ? page - 1 : 1);
    	if(!listpage[1])
          		p.one = {url : formatURL(str, 1), index : 1};
    }

    return p;
};

function formatURL(str, i){
	return str.replace(/\{1\}/g, i);
}