#! /usr/bin/env python3
import time
import json
import os
import threading
import re
import logging

import util.litchi
import config
from remote_console.remote_console import RemoteConsoleClient

class CutOverManage(threading.Thread):
    
    db = util.litchi.Litchi('cutover_task')

    def __init__(self):
        super().__init__()

    def update_task(self, task):
        return self.db.add_update_item(task)

    def delete_task(self, id):
        return self.db.delete_item_by_id(id)

    def get_all_tasks(self):
        return self.db.get_all_items()

    def check_channel_occupation(self, ip, freq):
        target = str(freq)
        re_freq = '(\d\d\d\d)\.000'
        
        client = RemoteConsoleClient(ip, username='root', password='ALu12#')
        if client is None: return -1, True
        r = client.connect_otn()
        if r < 0: return -2, True
        r, msg = client.exec('show xc full\n', '# ')
        client.close()
        if r < 0:
            logging.warning("查询已使用频点操作失败了")
            return -3, True
        else:
            logging.info("查询已使用频点操作完成了")
        
        r = re.findall(re_freq, msg, flags=re.M)
        if r is None:
            return -4, True
        if target in r:
            return 1, True
        else:
            return 1, False

    def check_channel_number_valid(self, freq):
        '''
        正常波长范围9170-9600，9175-9605，10的整数倍增加
        '''
        target = int(freq)
        if target >= 9170 and target <= 9605 and target%5 == 0:
            return True
        else:
            return False

    def exec_cutover_task(self, task, isRollback=False):
        '''
        执行一个单个割接任务
        '''
        # 参数生成
        # re_l = '-(\d+-\d+-L\d+)$'
        # re_l = '-(\d+-\d+-.*)$'
        re_l = '^(.*)-(\d+-\d+-.*)$'
        re_sfd = 'SFD-(\d+-\d+-\d+)$'
        re_line = '-(\d+-\d+-Line.*)$'
        old_freq = task["frequency"]
        new_freq = task["new_frequency"]
        rate = task["layerRate"]
        new_name = task["new_linkName"]
        old_name = task["linkName"]
        # a端IP
        aIP = task["a"]["ip"]
        # a端线路端口
        r = re.search(re_l, task["a"]["lPortLabel"], flags=re.I)
        if r is None: 
            return -1
        else:
            aL_type = r.group(1).lower()
            aL = r.group(2).replace('-', '/')
        # a端合分波端口
        r = re.search(re_sfd, task["a"]["sfdPortLabel"], flags=re.I)
        if r is None: 
            return -2
        else:
            aSfd = r.group(1).replace('-', '/')
        r = re.search(re_sfd, task["a"]["new_sfdPortLabel"], flags=re.I)
        if r is None: 
            return -3
        else:
            aSfd_new = r.group(1).replace('-', '/')
        # a端放大line口
        r = re.search(re_line, task["a"]["linePortLabel"], flags=re.I)
        if r is None: 
            return -4
        else:
            aLine = r.group(1).replace('-', '/')
        r = re.search(re_line, task["a"]["new_linePortLabel"], flags=re.I)
        if r is None: 
            return -5
        else:
            aLine_new = r.group(1).replace('-', '/')
        aLineout = None
        aLineout_new = None
        aLinein = None
        aLinein_new = None
        if "linePortLabel2" in task["a"] and "new_linePortLabel2" in task["a"]:
            r = re.search(re_line, task["a"]["linePortLabel2"], flags=re.I)
            if r is None:
                return -6
            else:
                aLine2 = r.group(1).replace('-', '/')
            r = re.search(re_line, task["a"]["new_linePortLabel2"], flags=re.I)
            if r is None:
                return -6
            else:
                aLine2_new = r.group(1).replace('-', '/')
            if "lineout" in aLine.lower():
                aLineout = aLine
                aLineout_new = aLine_new
            elif "lineout" in aLine2.lower():
                aLineout = aLine2
                aLineout_new = aLine2_new
            if "linein" in aLine.lower():
                aLinein = aLine
                aLinein_new = aLine_new
            elif "linein" in aLine2.lower():
                aLinein = aLine2
                aLinein_new = aLine2_new
        # z端IP
        zIP = task["z"]["ip"]
        # z端线路端口
        r = re.search(re_l, task["z"]["lPortLabel"], flags=re.I)
        if r is None: 
            return -7
        else:
            zL_type = r.group(1).lower()
            zL = r.group(2).replace('-', '/')
        # z端合分波端口
        r = re.search(re_sfd, task["z"]["sfdPortLabel"], flags=re.I)
        if r is None: 
            return -8
        else:
            zSfd = r.group(1).replace('-', '/')
        r = re.search(re_sfd, task["z"]["new_sfdPortLabel"], flags=re.I)
        if r is None: 
            return -9
        else:
            zSfd_new = r.group(1).replace('-', '/')
        # z端放大line口
        r = re.search(re_line, task["z"]["linePortLabel"], flags=re.I)
        if r is None: 
            return -10
        else:
            zLine = r.group(1).replace('-', '/')
        r = re.search(re_line, task["z"]["new_linePortLabel"], flags=re.I)
        if r is None: 
            return -11
        else:
            zLine_new = r.group(1).replace('-', '/')
        zLinein = None
        zLinein_new = None            
        zLineout = None
        zLineout_new = None
        if "linePortLabel2" in task["z"] and "new_linePortLabel2" in task["z"]:
            r = re.search(re_line, task["z"]["linePortLabel2"], flags=re.I)
            if r is None:
                return -12
            else:
                zLine2 = r.group(1).replace('-', '/')
            r = re.search(re_line, task["z"]["new_linePortLabel2"], flags=re.I)
            if r is None:
                return -12
            else:
                zLine2_new = r.group(1).replace('-', '/')
            if "linein" in zLine.lower():
                zLinein = zLine
                zLinein_new = zLine_new
            elif "linein" in zLine2.lower():
                zLinein = zLine2
                zLinein_new = zLine2_new
            if "lineout" in zLine.lower():
                zLineout = zLine
                zLineout_new = zLine_new
            elif "lineout" in zLine2.lower():
                zLineout = zLine2
                zLineout_new = zLine2_new
        
        # 指派苟且割接回滚命令集
        if not isRollback:
            # 频点数字就错了？
            if not self.check_channel_number_valid(new_freq):
                logging.warning("The target frequency number is not valid")
                time.sleep(10)
                return -1000
            s, r = self.check_channel_occupation(aIP, new_freq)
            logging.debug(f"s={s}, r={r}")
            if r:
                logging.warning("The target frequency has been occupied")
                return -2000
            s, r = self.check_channel_occupation(zIP, new_freq)
            logging.debug(f"s={s}, r={r}")
            if r:
                logging.warning("The target frequency has been occupied")
                return -2001
        else:
            if task["result"] < -999:
                time.sleep(20)
                return 1

        # 指派割接命令集
        if zLinein is not None and zLinein_new is not None and aLineout is not None and aLineout_new is not None:
            return self.single_direction_amp_no_relay(old_freq, new_freq, old_name, new_name, rate, 
                                                      aIP, aL, aLineout, aLinein, aL_type, aSfd, aSfd_new, aLineout_new,
                                                      zIP, zL, zLineout, zLinein, zL_type, zSfd, zSfd_new, zLinein_new, 
                                                      isRollback)
        else:
            return self.bi_direction_amp_no_relay(old_freq, new_freq, old_name, new_name, rate, 
                                                      aIP, aL, aLine, aL_type, aSfd, aSfd_new, aLine_new,
                                                      zIP, zL, zLine, zL_type, zSfd, zSfd_new, zLine_new, 
                                                      isRollback)

    def bi_direction_amp_no_relay(
        self, old_freq, new_freq, old_name, new_name, rate,
        aIP, aL, aLine, aL_type, aSfd, aSfd_new, aLine_new, 
        zIP, zL, zLine, zL_type, zSfd, zSfd_new, zLine_new,
        isRollback=False):
        '''
        点对点 无中继 双向光放 波长割接
        '''
        # 源端操作
        client = RemoteConsoleClient(aIP, username='root', password='ALu12#')
        if client is None: return -101
        r = client.connect_otn()
        if r < 0: return -102
        if not isRollback:
            r = client.exec_batch([
                (f'config xc {aL} {aLine} {old_freq} state down\n', "# ", "Error"),
                (f'config xc {aL} {aLine} {old_freq} delete yes\n', "# ", "Error"),
                (f'config interface topo {aL} delete\n', "# ", "Error"),
                ('#DELAY@5s', ""),
                (f'config interface {aL_type} {aL} state down\n', "# "),
                ('#DELAY@5s', ""),
                (f'config interface {aL} {rate} channeltx {new_freq}\n', "# ", "Error"),
                (f'config interface {aL} {rate} channelrx {new_freq}\n', "# ", "Error"),
                ('#DELAY@5s', ""),
                (f'config interface {aL_type} {aL} state up\n', "# "),
                (f'config interface topo {aL} internal {aSfd_new} bi\n', "# ", "Error"),
                ('#DELAY@5s', ""),
                (f'config xc {aL} {aLine_new} {new_freq} create "{new_name}" bi none unkey\n', "# ", "Error"),
                (f'config xc {aL} {aLine_new} {new_freq} state up\n', "# ", "Error")
            ])
        else:
            r = client.exec_batch([
                (f'config xc {aL} {aLine_new} {new_freq} state down\n', "# "),
                (f'config xc {aL} {aLine_new} {new_freq} delete yes\n', "# "),
                (f'config interface topo {aL} delete\n', "# "),
                ('#DELAY@5s', ""),
                (f'config interface {aL_type} {aL} state down\n', "# "),
                ('#DELAY@5s', ""),
                (f'config interface {aL} {rate} channeltx {old_freq}\n', "# "),
                (f'config interface {aL} {rate} channelrx {old_freq}\n', "# "),
                ('#DELAY@5s', ""),
                (f'config interface {aL_type} {aL} state up\n', "# "),
                (f'config interface topo {aL} internal {aSfd} bi\n', "# "),
                ('#DELAY@5s', ""),
                (f'config xc {aL} {aLine} {old_freq} create "{old_name}" bi none unkey\n', "# "),
                (f'config xc {aL} {aLine} {old_freq} state up\n', "# ")
            ])

        client.close()
        if r < 0:
            logging.warning("源端操作失败了")
            return r-200
        else:
            logging.info("源端操作完成了")
        
        # 宿端操作
        client = RemoteConsoleClient(zIP, username='root', password='ALu12#')
        if client is None: return -102
        client.connect_otn()
        if not isRollback:
            r = client.exec_batch([
                (f'config xc {zL} {zLine} {old_freq} state down\n', "# ", "Error"),
                (f'config xc {zL} {zLine} {old_freq} delete yes\n', "# ", "Error"),
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
                (f'config xc {zL} {zLine_new} {new_freq} create "{new_name}" bi none unkey\n', "# ", "Error"),
                (f'config xc {zL} {zLine_new} {new_freq} state up\n', "# ", "Error")
            ])
        else:
            r = client.exec_batch([
                (f'config xc {zL} {zLine_new} {new_freq} state down\n', "# "),
                (f'config xc {zL} {zLine_new} {new_freq} delete yes\n', "# "),
                (f'config interface topo {zL} delete\n', "# "),
                ('#DELAY@5s', ""),
                (f'config interface {zL_type} {zL} state down\n', "# "),
                ('#DELAY@5s', ""),
                (f'config interface {zL} {rate} channeltx {old_freq}\n', "# "),
                (f'config interface {zL} {rate} channelrx {old_freq}\n', "# "),
                ('#DELAY@5s', ""),
                (f'config interface {zL_type} {zL} state up\n', "# "),
                (f'config interface topo {zL} internal {zSfd} bi\n', "# "),
                ('#DELAY@5s', ""),
                (f'config xc {zL} {zLine} {old_freq} create "{old_name}" bi none unkey\n', "# ",),
                (f'config xc {zL} {zLine} {old_freq} state up\n', "# ")
            ])

        client.close()
        if r < 0:
            logging.warning("宿端操作失败了")
            return r-300
        else:
            logging.info("宿端操作完成了")

        return 1

    def single_direction_amp_no_relay(
        self, old_freq, new_freq, old_name, new_name, rate,
        aIP, aL, aLineout, aLinein, aL_type, aSfd, aSfd_new, aLineout_new, 
        zIP, zL, zLineout, zLinein, zL_type, zSfd, zSfd_new, zLinein_new,
        isRollback=False):
        '''
        点到点  无中继  单向光放  波长割接
        '''
        # 源端操作
        client = RemoteConsoleClient(aIP, username='root', password='ALu12#')
        if client is None: return -101
        r = client.connect_otn()
        if r < 0: return -102
        if not isRollback:
            r = client.exec_batch([
                (f'config xc {aL} {aLineout} {old_freq} state down\n', "# "),
                (f'config xc {aLinein} {aL} {old_freq} state down\n', "# "),
                (f'config xc {aL} {aLineout} {old_freq} delete yes\n', "# "),
                (f'config xc {aLinein} {aL} {old_freq} delete yes\n', "# "),
                (f'config interface topo {aL} delete\n', "# ", "Error"),
                ('#DELAY@5s', ""),
                (f'config interface {aL_type} {aL} state down\n', "# "),
                ('#DELAY@5s', ""),
                (f'config interface {aL} {rate} channeltx {new_freq}\n', "# ", "Error"),
                (f'config interface {aL} {rate} channelrx {new_freq}\n', "# ", "Error"),
                ('#DELAY@5s', ""),
                (f'config interface {aL_type} {aL} state up\n', "# "),
                (f'config interface topo {aL} internal {aSfd_new} bi\n', "# ", "Error"),
                ('#DELAY@5s', ""),
                (f'config xc {aL} {aLineout_new} {new_freq} create "{new_name}" bi none unkey\n', "# ", "Error"),
                (f'config xc {aL} {aLineout_new} {new_freq} state up\n', "# ", "Error")
            ])            
        else:
            r = client.exec_batch([
                (f'config xc {aL} {aLineout_new} {new_freq} state down\n', "# "),
                (f'config xc {aL} {aLineout_new} {new_freq} delete yes\n', "# "),
                (f'config interface topo {aL} delete\n', "# "),
                ('#DELAY@5s', ""),
                (f'config interface {aL_type} {aL} state down\n', "# "),
                ('#DELAY@5s', ""),
                (f'config interface {aL} {rate} channeltx {old_freq}\n', "# "),
                (f'config interface {aL} {rate} channelrx {old_freq}\n', "# "),
                ('#DELAY@5s', ""),
                (f'config interface {aL_type} {aL} state up\n', "# "),
                (f'config interface topo {aL} internal {aSfd} bi\n', "# "),
                ('#DELAY@5s', ""),
                (f'config xc {aL} {aLineout} {old_freq} create "{old_name}" bi none unkey\n', "# "),
                (f'config xc {aL} {aLineout} {old_freq} state up\n', "# ")
            ])

        client.close()
        if r < 0:
            logging.warning("源端操作失败了")
            return r-200
        else:
            logging.info("源端操作完成了")        

        # 宿端操作
        client = RemoteConsoleClient(zIP, username='root', password='ALu12#')
        if client is None: return -102
        client.connect_otn()
        if not isRollback:
            r = client.exec_batch([
                (f'config xc {zLinein} {zL} {old_freq} state down\n', "# "),
                (f'config xc {zL} {zLineout} {old_freq} state down\n', "# "),
                (f'config xc {zLinein} {zL} {old_freq} delete yes\n', "# "),
                (f'config xc {zL} {zLineout} {old_freq} delete yes\n', "# "),
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
                (f'config xc {zLinein_new} {zL} {new_freq} create "{new_name}" bi none unkey\n', "# ", "Error"),
                (f'config xc {zLinein_new} {zL} {new_freq} state up\n', "# ", "Error")
            ])
        else:
            r = client.exec_batch([
                (f'config xc {zLinein_new} {zL} {new_freq} state down\n', "# "),
                (f'config xc {zLinein_new} {zL} {new_freq} delete yes\n', "# "),
                (f'config interface topo {zL} delete\n', "# "),
                ('#DELAY@5s', ""),
                (f'config interface {zL_type} {zL} state down\n', "# "),
                ('#DELAY@5s', ""),
                (f'config interface {zL} {rate} channeltx {old_freq}\n', "# "),
                (f'config interface {zL} {rate} channelrx {old_freq}\n', "# "),
                ('#DELAY@5s', ""),
                (f'config interface {zL_type} {zL} state up\n', "# "),
                (f'config interface topo {zL} internal {zSfd} bi\n', "# "),
                ('#DELAY@5s', ""),
                (f'config xc {zLinein} {zL} {old_freq} create "{old_name}" bi none unkey\n', "# ",),
                (f'config xc {zLinein} {zL} {old_freq} state up\n', "# ")
            ])

        client.close()
        if r < 0:
            logging.warning("宿端操作失败了")
            return r-300
        else:
            logging.info("宿端操作完成了")

        return 1        
        
    def exec_tasks_by_id(self, id, isRollback=False):
        # step1: 获取要执行的任务群
        all_task_groups = self.db.get_all_items()
        for group in all_task_groups:
            if group["id"] == id:
                selected_group = group
                break
        else:
            warning_message = f"exec task_group[id={id}]: not found"
            logging.warning(warning_message)
            return warning_message
        # step2: 无视执行规则,强行执行
        all_success = True
        for index in range(len(selected_group["items"])):
            task = selected_group["items"][index]
            r = self.exec_cutover_task(task, isRollback=isRollback)
            # 操作失败
            if r < 0: 
                all_success = False
                task["result"] = r
        if all_success:
            if isRollback: 
                selected_group["status"] = 2
            else:
                selected_group["status"] = 1
                if config.CUTOVER_MANUAL_TIME_RECORD == 1 and selected_group["isManual"] == 1:
                    selected_group["execTime"] = int(time.time() * 1000)
        else:
            if isRollback: 
                selected_group["status"] = -2
            else:
                selected_group["status"] = -1
                if config.CUTOVER_MANUAL_TIME_RECORD == 1 and selected_group["isManual"] == 1:
                    selected_group["execTime"] = int(time.time() * 1000)
        self.db.add_update_item(selected_group)
        return selected_group["status"]

    def run(self):
        time.sleep(1)
        while True:
            # 获取13位时间戳
            current_timestamp = int(round(time.time() * 1000))
            task_groups = self.db.get_all_items()
            for group in task_groups:
                if group["status"] != 0:
                    continue
                if group["isManual"] == 1:
                    continue
                if int(group["execTime"]) < current_timestamp:
                    self.exec_tasks_by_id(group["id"], False)
            time.sleep(100)


if __name__ == "__main__":
    cutover_manager = CutOverManage()
    cutover_manager.check_channel_occupation("172.24.166.141", 9190)
    # cutover_manager.exec_tasks_by_id(10)
    # cutover_manager.start()