exports.format_date = function (date, friendly) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  if (friendly) {
    var now = new Date();
    var mseconds = -(date.getTime() - now.getTime());
    var time_std = [ 1000, 60 * 1000, 60 * 60 * 1000, 24 * 60 * 60 * 1000 ];
    if (mseconds < time_std[3]) {
      if (mseconds > 0 && mseconds < time_std[1]) {
        return Math.floor(mseconds / time_std[0]).toString() + ' 秒前';
      }
      if (mseconds > time_std[1] && mseconds < time_std[2]) {
        return Math.floor(mseconds / time_std[1]).toString() + ' 分钟前';
      }
      if (mseconds > time_std[2]) {
        return Math.floor(mseconds / time_std[2]).toString() + ' 小时前';
      }
    }
  }

  //month = ((month < 10) ? '0' : '') + month;
  //day = ((day < 10) ? '0' : '') + day;
  hour = ((hour < 10) ? '0' : '') + hour;
  minute = ((minute < 10) ? '0' : '') + minute;
  second = ((second < 10) ? '0' : '') + second;

  var thisYear = new Date().getFullYear();
  year = (thisYear === year) ? '' : (year + '-');
  return year + month + '-' + day + ' ' + hour + ':' + minute;
};

exports.format_body_head = function(html){
    if(html != null && typeof html != 'undefined'){
      var tmp = html.replace(/<.+?>/g,'');

      if(tmp.length > 200)
        return tmp.substr(0, 200) + '...';
      else
        return tmp;  
    }else{
      return '';
    }
};


var br = {};  
br.spTags = ["img","br","hr"];/*不需要成对出现的标记*/  
br.contain = function(arr,it){  
    for(var i=0,len=arr.length;i<len;i++){  
        if(arr[i]==it){  
            return true;      
        }  
    }  
    return false;  
}  
br.subArtc = function(article,worldNum){  
    var result = [];  
    /*首先截取需要的字串*/  
    var wcount = 0;  
    var startTags = [],endTags = [];  
    var isInTag = false;  
    for(var i=0,len=article.length;i<len;i++){  
        var w = article[i];  
        result.push(w);  
        if(w=="<"){  
            isInTag = true;      
        }  
        if(!isInTag){  
            wcount++;  
            if(wcount==worldNum){  
                break;      
            }  
        }  
        if(w==">"){  
            isInTag = false;      
        }  
    }  
    /*对字串进行处理*/
    var j=0;  
    isInTag = false;  
    var isStartTag = true;  
    var tagTemp = "";  
    while(j<i){  
        w = result[j];  
        if(isInTag){  
            if(w==">" || w==" " || w=="/"){  
                isInTag = false;  
                if(isStartTag){  
                    startTags.push(tagTemp);      
                }else{  
                    endTags.push(tagTemp);      
                }  
                tagTemp = "";  
            }  
            if(isInTag){  
                tagTemp+=w;      
            }  
        }  
        if(w=="<"){  
            isInTag = true;  
            if(result[j+1]=="/"){  
                isStartTag = false;  
                j++;  
            }else{  
                isStartTag = true;      
            }  
        }  
        j++;  
    }  
    /*剔除img,br等不需要成对出现的标记*/  
    var newStartTags = [];  
    for(var x=0,len=startTags.length;x<len;x++){  
        if(!br.contain(br.spTags,startTags[x])){  
            newStartTags.push(startTags[x]);  
        }  
    }  
    /*添加没有的结束标记*/  
    var unEndTagsCount = newStartTags.length - endTags.length;  
    while(unEndTagsCount>0){  
        result.push("<");  
        result.push("/")  
        result.push(newStartTags[unEndTagsCount-1]);  
        result.push(">");  
        unEndTagsCount--;  
    }  
    return result.join("");  
};  