require.config({
	baseUrl: '/',
	paths: {
                    'jquery': 'lib/js/jquery-1.11.0.min',
                    'base' :'js/base',
                    'bootstrap' : 'lib/bootstrap/js/bootstrap.min',
                    'ye_check' : 'js/ye.check',
                    'blog' : 'js/blog',
                    marked          : "mdeditor/lib/marked.min",
                    prettify        : "mdeditor/lib/prettify.min",
                    raphael         : "mdeditor/lib/raphael.min",
                    underscore      : "mdeditor/lib/underscore.min",
                    flowchart       : "mdeditor/lib/flowchart.min", 
                    jqueryflowchart : "mdeditor/lib/jquery.flowchart.min", 
                    sequenceDiagram : "mdeditor/lib/sequence-diagram.min",
                    katex           : "//cdnjs.cloudflare.com/ajax/libs/KaTeX/0.1.1/katex.min",
                    editormd        : "mdeditor/editormd.amd.min" // Using Editor.md amd version for Require.js
                },
              shim:{
                    'bootstrap' : ['jquery'],
                    'base' : ['jquery','bootstrap'],
                    'ye_check' : ['jquery'],
                    'marked' : ['jquery'],
                    'editormd' : ['jquery','raphael'],
                    'jqueryflowchart' : ['flowchart']
            },
            waitSeconds: 30
});