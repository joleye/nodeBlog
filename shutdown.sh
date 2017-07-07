#ps aux|grep -v grep|grep node\ app\.js|awk '{print $2}'|xargs kill -9

ps aux|grep -v grep|grep supervisor\ app\.js|awk '{print $2}'|xargs kill -9
