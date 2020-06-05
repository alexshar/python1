#! /usr/bin/env python3
import time
import json
import os
import threading
import re

#import telnetlib
#http://docs.paramiko.org/en/stable/api/client.html
#import paramiko

import util.litchi
from remote_console.ssh_client import SSHClient 
from remote_console.telnet_client import TelnetClient
import remote_console.remote_console

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

    def exec_cutover_task(self, task, isRollback=False):
        '''
        执行一个单个割接任务
        '''
        # 参数生成
        # re_l = '-(\d+-\d+-L\d+)$'
        re_l = '-(\d+-\d+-.*)$'
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
            aL = r.group(1).replace('-', '/')
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
        # z端IP
        zIP = task["z"]["ip"]
        # z端线路端口
        r = re.search(re_l, task["z"]["lPortLabel"], flags=re.I)
        if r is None: 
            return -7
        else:
            zL = r.group(1).replace('-', '/')
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
        # 源端操作
        client = SSHClient(aIP, 'root', 'ALu12#')
        if client is None: return -101
        r = client.connect()
        if r < 0: return -102
        if isRollback:
            r = client.exec_batch([
                ('vsim cli\n', 'Username: '),
                ('admin\n', 'Password: '),
                ('admin\n', '(Y/N)?'),
                ('Y\n', "# "),
                (f'config xc {aL} {aLine_new} {new_freq} state down\n', "# "),
                (f'config xc {aL} {aLine_new} {new_freq} delete yes\n', "# "),
                (f'config interface topo {aL} delete\n', "# "),
                ('#DELAY@10s', ""),
                (f'config interface {aL} {rate} channeltx {old_freq}\n', "# "),
                (f'config interface {aL} {rate} channelrx {old_freq}\n', "# "),
                (f'config interface topo {aL} internal {aSfd} bi\n', "# "),
                ('#DELAY@10s', ""),
                (f'config xc {aL} {aLine} {old_freq} create "{old_name}" bi none unkey\n', "# "),
                (f'config xc {aL} {aLine} {old_freq} state up\n', "# "),
                ('logout\n', ']# ')
            ])
        else:
            r = client.exec_batch([
                ('vsim cli\n', 'Username: '),
                ('admin\n', 'Password: '),
                ('admin\n', '(Y/N)?'),
                ('Y\n', "# "),
                (f'config xc {aL} {aLine} {old_freq} state down\n', "# ", "Error"),
                (f'config xc {aL} {aLine} {old_freq} delete yes\n', "# ", "Error"),
                (f'config interface topo {aL} delete\n', "# ", "Error"),
                ('#DELAY@10s', ""),
                (f'config interface {aL} {rate} channeltx {new_freq}\n', "# ", "Error"),
                (f'config interface {aL} {rate} channelrx {new_freq}\n', "# ", "Error"),
                (f'config interface topo {aL} internal {aSfd_new} bi\n', "# ", "Error"),
                ('#DELAY@10s', ""),
                (f'config xc {aL} {aLine_new} {new_freq} create "{new_name}" bi none unkey\n', "# ", "Error"),
                (f'config xc {aL} {aLine_new} {new_freq} state up\n', "# ", "Error"),
                ('logout\n', ']# ')
            ])
        client.close()
        if r < 0:
            print("源端操作失败了")
            return r-200
        else:
            print("源端操作完成了")
        
        
        # 宿端操作
        client = SSHClient(zIP, 'root', 'ALu12#')
        if client is None: return -102
        client.connect()
        if isRollback:
            r = client.exec_batch([
                ('vsim cli\n', 'Username: '),
                ('admin\n', 'Password: '),
                ('admin\n', '(Y/N)?'),
                ('Y\n', "# "),
                (f'config xc {zL} {zLine_new} {new_freq} state down\n', "# "),
                (f'config xc {zL} {zLine_new} {new_freq} delete yes\n', "# "),
                (f'config interface topo {zL} delete\n', "# "),
                ('#DELAY@10s', ""),
                (f'config interface {zL} {rate} channeltx {old_freq}\n', "# "),
                (f'config interface {zL} {rate} channelrx {old_freq}\n', "# "),
                (f'config interface topo {zL} internal {zSfd} bi\n', "# "),
                ('#DELAY@10s', ""),
                (f'config xc {zL} {zLine} {old_freq} create "{old_name}" bi none unkey\n', "# ",),
                (f'config xc {zL} {zLine} {old_freq} state up\n', "# "),
                ('logout\n', ']# ')
            ])
        else:
            r = client.exec_batch([
                ('vsim cli\n', 'Username: '),
                ('admin\n', 'Password: '),
                ('admin\n', '(Y/N)?'),
                ('Y\n', "# "),
                (f'config xc {zL} {zLine} {old_freq} state down\n', "# ", "Error"),
                (f'config xc {zL} {zLine} {old_freq} delete yes\n', "# ", "Error"),
                (f'config interface topo {zL} delete\n', "# ", "Error"),
                ('#DELAY@10s', ""),
                (f'config interface {zL} {rate} channeltx {new_freq}\n', "# ", "Error"),
                (f'config interface {zL} {rate} channelrx {new_freq}\n', "# ", "Error"),
                (f'config interface topo {zL} internal {zSfd_new} bi\n', "# ", "Error"),
                ('#DELAY@10s', ""),
                (f'config xc {zL} {zLine_new} {new_freq} create "{new_name}" bi none unkey\n', "# ", "Error"),
                (f'config xc {zL} {zLine_new} {new_freq} state up\n', "# ", "Error"),
                ('logout\n', ']# ')
            ])
        client.close()
        if r < 0:
            print("宿端操作失败了")
            return r-300
        else:
            print("宿端操作完成了")

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
            print(warning_message)
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
        else:
            if isRollback: 
                selected_group["status"] = -2
            else:
                selected_group["status"] = -1
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
    # cutover_manager.exec_tasks_by_id(10)
    cutover_manager.start()