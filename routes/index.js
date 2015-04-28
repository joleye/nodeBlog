
/*
 * GET home page.
 */

exports.index = function(req, res){
  	//console.log(req.headers);

/*	var hbase = require('hbase');
   	      var client = hbase({
      		host:'localhost',
         		port:8090
     	});*/


   	 //    console.log(hbase);

  	//res.render('list',[]);


  	res.render('index', { title: 'NodeBlog' });
};
