# SSH&Telnet脚本

### 使用范围

在项目构建初期，尤其是二次开发的项目，软件当前的功能和目标可能有差距。可能因为工期、原开发团队支持的限制，不能第一时间用最优雅的方式给出解决方案。有些功能调用需要用到相关网元提供的zic接口，这个脚本可以在后台调用zic的SSH或Telnet服务，完成系列操作。由于效能的关系，不建议在产品化的解决方案中使用，最适合的场景是制作补丁，例如OTN测试。



### 系统需求

需要python3。目前测试3.6.x及以上版本均可。若提示依赖库不存在，可以用下面的命令来安装：

`pip3 --proxy=http://xxx.xxx.xxx:8080 install xxxx yyyy zzzz`



### 使用方法

调用remote_console，为RemoteConsoleClient生成一个实例，参数为远程机器的IP, port, username, password。

主要的方法有：

- connect()
  - 产生连接，其内部会先尝试SSH协议，不行就换Telnet
- exec(command, expected, error_message)
  - command为输入的命令
  - expected为成功后终端的输出
  - error_message为可能出现的错误提示
  - 输出是一个tuple（s，msg），其中s为状态码，1即为成功，msg是捕捉到的控制台输出字符串（可能为多行）
 - exec_batch(list)
  - 执行一个命令序列
 - close()

可以看下面这个例子（一种割接场景的源端）：

```python
from remote_console.remote_console import RemoteConsoleClient

client = RemoteConsoleClient('127.0.0.1', username='root', password='ALu12#')
client.connect()
# 这里只需要把需要执行的命令序列写完即可，特别注意回车一定要表示为\n
r = client.exec_batch([
                (f'config xc {zLinein} {zL} {old_freq} state down\n', "# ", "Error"),
                (f'config xc {zLinein} {zL} {old_freq} delete yes\n', "# ", "Error"),
                (f'config interface topo {zL} delete\n', "# ", "Error"),
                ('#DELAY@5s', ""),
                (f'config interface {zL_type} {zL} state down\n', "# "),
                ('#DELAY@5s', ""),
                (f'config interface {zL} {rate} channeltx {new_freq}\n', "# ", "Error"),
                (f'config interface {zL} {rate} channelrx {new_freq}\n', "# ", "Error"),
                ('#DELAY@5s', ""),
                (f'config interface {zL_type} {zL} state up\n', "# "),
                (f'config interface topo {zL} internal {zSfd_new} bi\n', "# ", "Error"),
                ('#DELAY@5s', ""),
                (f'config xc {zLinein_new} {zL} {new_freq} create "{new_name}" bi none auto\n', "# ", "Error"),
                (f'config xc {zLinein_new} {zL} {new_freq} state up\n', "# ", "Error")
            ])
        client.close()
        if r < 0:
            logging.warning("操作失败了")
            return r-300
        else:
            logging.info("操作完成了")
```



