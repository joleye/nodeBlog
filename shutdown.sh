ps aux|grep -v grep|grep node\ app\.js|awk '{print $2}'|xargs kill -9
