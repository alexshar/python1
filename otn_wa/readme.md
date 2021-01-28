# OTN补丁说明

以下是为OTN准备的新补丁。为了之前补丁的做的修正，不在此列，它们也没有引入新的依赖，使用方法也和从前一样。

### WEB前端

web前端文件全部部署在

```
/usr/Systems/Global_Instance_19_Master/EQM_WS/eqm/omc_all
```

创建对应的菜单，并需要挂载到现有的NSP菜单中。其中：

> ASprobableCauses.html => 9.1.1 告警名称
>
> ASforLos.html
>
> Performance-Data-Save.html => 10.1.5 性能数据存储
>
> SingleOpticalPortReset.html => 7.2.5.4 调制方式管理 之 单光口复位
>
> Alarm-Data-Backup.html => 7.1.1  告警保存与存储

##### 开发中：

- 10.1.3. 性能实时上报

- 14.8. 波长漂移检测

依赖的文件放在js目录和css目录下：

> js/vue.min.js
> js/vue.js
> js/element.js
> js/echarts.min.js
> js/echarts.js
> js/axios.min.js
> cs/index.css


### 公共后端

为了实现某些功能，弥补纯前端页面的不足，开发了一个简易的后端服务。为了让它正确运行，需要：

1. 有python3的基础运行环境，目前调试测试使用的是python3.7.x，和python3.8.x。
2. 安装python库，使用（sudo pip3 install [包名]）。包括： FTP，flask, flask_cors, pymongo, requests, cryptography

python脚本只有一层目录，启动文件为controller.py。建议以root账号，后台运行：`nohup python3 controller.py &` 运行成功后会监听5031端口（如果冲突，可以通过修改controller.py最后一行配置，修改端口）

python脚本清单如下：

> - controller.py
> - pm_data_ftp.py
> - alarm_data_ftp.py
> - alarm_names.py
> - enms_db.py
>

注意：由于我们没有证书，第一次访问，需要在浏览器弹出告警后，接受不安全的网页内容。

#### API
Cut Over 割接
task = 
{
    "id": "xxxx",
    "items": [
        {
            "linkName": "alsdjfaldjaljladj",
            "a": {
                "neName": "PSS32-140",
                "ip": "172.24.168.132",
                "lPortLabel": "xxxxyyyyzzzz",
                "sfdPortLabel": "bbbbb-9175",
                "oldChannel": 9175,
                "newChannel": 9185
            },
            "z": {
                "neName": "PSS32-152",
                "ip": "172.24.168.140",
                "lPortLabel": "xxxxyyyyzzzz",
                "sfdPortLabel": "bbbbb-9715",
                "oldChannel": 9175,
                "newChannel": 9185
            },
            "result": 0 | 1 | -1    // 0=未执行 1=成功 -1=失败 2=回滚成功 -2=回滚失败
        }
    ]
    "name": "（割）字第一号任务",
    "execTime": 15900000,
    "isManual": 0  // 0=自动   1=手动
    "status": 0    // 0=未执行 1=执行中 2=已经完成
}

API: "/cutover_task" 方法：DELETE(/cutover_task?id=xxxxx), POST(jsonbody=task), GET
API: "/cutover_exec" 方法: POST
body = {
    "id": "xxxx",
    "method": 0 | 1  // 0=搞  1=回滚
}
