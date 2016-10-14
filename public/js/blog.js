define(['jquery'],function(){
	return {
		drop : function(id,callback){
			if(confirm('确定要删除吗?')){
				$.post('/blog/edit/remove', {id : id},function(res){
					if(res){
						callback(res);
					}else{
						alert(res);
					}
				});	
			}
			
		}
	}
});