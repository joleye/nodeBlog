$(function(){
    var Sys = {};
    var ua = navigator.userAgent.toLowerCase();
    window.ActiveXObject ? Sys.ie = true : Sys.ie=false;
    if(Sys.ie){
        $(".preview_noie").html(lang.ienotsupport);
        $(".glyphicon-eye-open").parent().parent().remove();
    }

    $("#add_image").click(function(){
        var img_num = $("div[name=source_image]").length;
        if (img_num < 9) {
            $("div[name=source_image]:first").clone(true).appendTo("#foo");
            $("div[name=source_image]:last").children().children(".file").val('');
            $("#msg").html("");
        }else{
            msg(lang.max9);
        }
        //update_form();
    });

    $("button[name=remove_image]").click(function(){
        var img_num = $("div[name=source_image]").length;
        if(img_num>1){
            $(this).parent("div[name=source_image]").remove();
            $("#msg").html("");
        }else{
            msg(lang.min1);
        }
        // update_form();
    });

    $(".btn-primary").click(function(){
        var post_str = new Object();
        var m=0;
        post_str['file'] = new Object();
        $('input[type=file]').each(function(i){
            if(this.value) {
                post_str['file'][i]=this.value;
                m++;
            }
        });
        if(m<1){
            msg(lang.minsel1);
            return false;
        }
        post_str['ico_target_size'] = $("input[name=ico_target_size]").val();
        post_str['accept-show'] = $("input[name=accept_show]").val();
        msg('<img src="/public/img/load.gif" border="0" />');
//        $.post('/favicon',$.param(post_str),function(data){
//            console.log(222);
//        })
        $("form").submit();
    })

    $(".download,.download_fav").click(function(){
        $("#jUploadFramedownload_favicon").remove();
        var file = $(this).attr("data-url");
        if(file){
            $.createUploadIframe('download_favicon','/favicon/download?ico='+file);
        }
    })

    $(".dropdown-toggle").mouseover(function(){
        $(".dropdown-menu").show();
        $(".dropdown-menu").bind("mouseleave",hidediv);
    });

    $(".lang_more").click(function(){
        $(".options").show();
        $(".options").bind("mouseleave",hidediv);
    });

    $(".copy").mouseover(function(){
        $(this).css("color","blue");
    })
    $(".copy").mouseout(function(){
        $(this).css("color","");
    })
    $(".copy").zclip({
        path: "/public/ZeroClipboard.swf",
        copy: function(){
            return $(this).text();
        },
        beforeCopy:function(){/* 按住鼠标时的操作 */
            $(this).css("color","orange");
        },

        afterCopy:function(){/* 复制成功后的操作 */
            var $copysuc = $('<div class="alert alert-success" role="alert">'+lang.copied+'</div>');
            $("body").find(".alert").remove().end().append($copysuc);
            $copysuc.css({
                "position":"fixed",
                "z-index":"999",
                "bottom":"50%",
                "left":"50%",
                "margin":"0 0 -20px -80px"
            });
            $(".alert").fadeOut(2000);
            $(this).css("color","");
        }
    });

});
function hidediv(){
    $(this).hide();
}
function preview(a){
    var file = $(a).parent().parent().children().children(".file");
    if(!file[0].value){
        msg(lang.minsel1);
        return false;
    }
    msg('<img src="/public/img/load.gif" border="0" />');
    ajaxFileUpload(file);
}

function ajaxFileUpload(a)
{
    var convert_type = $('form').attr('name');
    if(convert_type=='convert_ico'){
        var ico_target_size = $('input[name="ico_target_size"]:checked').val();
        post_url = '/favicon?action=ajax';
    }
    if(convert_type=='convert_ocd'){
        var ico_target_size = $('input[name="ico_target_size"]').val();
        post_url = '/ocd/generator?action=ajax';
    }
    $("#msg")
        .ajaxStart(function(){
            $(this).show();
        })
        .ajaxComplete(function(){
            $(this).hide();
            //update_form();
        });

    $.ajaxFileUpload
    (
        {
            url:post_url,
            secureuri:false,
            fileElement:a,
            dataType: 'json',
            data:{action:'ajax',ico_target_size:ico_target_size},
            success: function (data, status)
            {
                if(data[0]['return']['status']==1){
                    show_base64_img(data[0]['return']['file']);
                    $(".download_fav").attr("data-url",data[0]['return']['ico'])
                }
                    msg(data[0]['return']['msg']);

                if(typeof(data.error) != 'undefined')
                {
                    if(data.error != '')
                    {
                        msg(data.error);
                    }else
                    {
                        msg(data.msg);
                    }
                }
            },
            error: function (data, status, e)
            {
                msg(e);
            }
        }
    )

    return false;

}

function update_form(){
    $("#msg").html('');
}
function msg(msg){
    $("#msg").html(msg);
}

function show_base64_img(img){
    $("#page_favionc").attr('href',img);
    var convert_type = $('form').attr('name');
    if(convert_type=='convert_ico'){
        var bgid = "#favicon_ico";
        $(bgid).css({
            "background-image": "url("+img+")",
            "background-size": 'contain'
        });
    }
    if(convert_type=='convert_ocd'){
        var bgid = "#favicon_ocd";
        $(bgid).remove();
        $('.preview_ocd').css({
            "background-image": "url("+img+")",
            "background-size": 'contain'
        });

    }
}

function select(a){
    console.log(a.children[0]);
    console.log(a.children[0].attr('date').value);
    a.children[0].style='font-size:18px';
    a.children[0].css({
        "background-color": 'gray',
        "border":'1px solid gray'
    });

}
