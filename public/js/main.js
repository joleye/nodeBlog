require.config({
	baseUrl: '/public/',
	paths: {
                    'jquery': 'lib/js/jquery-1.11.0.min',
                    'base' :'js/base',
                    'bootstrap' : 'lib/bootstrap/js/bootstrap.min',
                    'ye_check' : 'js/ye.check',
                    'blog' : 'js/blog'
                },
              shim:{
                    'bootstrap' : ['jquery'],
                    'base' : ['jquery','bootstrap'],
                    'ye_check' : ['jquery']
            }
});