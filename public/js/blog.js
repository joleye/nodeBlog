define(['jquery'],function(){
	return {
		drop : function(id,callback){
			$.post('/blog/remove/'+id,function(res){
				if(res){
					callback(res.msg);
				}else{
					alert(res.msg);
				}
			})
		}
	}
});