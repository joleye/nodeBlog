define(['jquery'],function(){
	return {
		drop : function(id,callback){
			if(confirm('确定要删除吗?')){
				$.post('/blog/remove/'+id,function(res){
					if(res){
						callback(res.msg);
					}else{
						alert(res.msg);
					}
				});	
			}
			
		}
	}
});