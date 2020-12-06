#! /usr/bin/env python3
import time
import os
import logging

from util.litchi import Litchi
from util.telnet_client import TelnetClient

telnet_host = "135.251.96.98"
telnet_port = 29876

class AlarmInsert():
    def __init__(self, scheduler_ins):
        self.db_name = "alarm_insert_list"
        self.db_ins = Litchi(self.db_name)
        scheduler_ins.register(self.db_name, self.db_ins, self.insert_alarm)

    def add_task(self, task):
        delay = float(task["delay"])
        current = time.time() * 1000
        task["execTime"] = int(round(current + delay))
        self.db_ins.add_update_item(task)
        return "OK"

    def delete_task_by_id(self, id):
        self.db_ins.delete_item_by_id(id)
        return "OK"

    def get_tasks(self):
        return self.db_ins.get_all_items()
    
    def insert_alarm(self, task):
        logging.info("insert alarm:")
        logging.info(task)
        time_str = str(time.time())
        file_name = 'alarm_files' + os.sep + 'alarm'+time_str
        #alarm_str = f'simple,1.3.6.1.4.1.12.1.1,0.3.0.2.7.7=90|0.3.0.2.7.13=3|1.3.6.1.4.1.12.2.1={task["id"]},{task["category"]},{task["name"]},{task["severity"]},{task["object"]},-\n'
        alarm_str = f'simple,1.3.6.1.4.1.12.1.1,0.3.0.2.7.7=90|0.3.0.2.7.13=3|1.3.6.1.4.1.12.2.1={task["object"]},{task["category"]},{task["name"]},{task["severity"]},{task["object"]},-\n'
        f = open(file_name, 'w', encoding='utf-8')
        f.write(alarm_str)
        f.close()
        path = os.path.abspath(file_name).encode('ascii') + b'\n'
        tl = TelnetClient(telnet_host, "", "", port=telnet_port)
        r = tl.connect(None)
        if r < 0:
            task["status"] = -1
            self.db_ins.update_item(task)
            return -1
        tl.exec(path)
        # tl = telnetlib.Telnet(telnet_host, telnet_port)
        # time.sleep(1)
        # tl.write(path)
        # command_result = tl.read_very_eager().decode('ascii')
        # time.sleep(5)
        tl.close()
        task["status"] = 1
        self.db_ins.update_item(task)
        return 1

    def clear_alarm(self, task):
        logging.info("clear alarm:")
        logging.info(task)
        time_str = str(time.time())
        file_name = 'alarm_files' + os.sep + 'alarm'+time_str
        #alarm_str = f'simple,1.3.6.1.4.1.12.1.1,0.3.0.2.7.7=90|0.3.0.2.7.13=3|1.3.6.1.4.1.12.2.1={task["id"]},{task["category"]},{task["name"]},cleared,{task["object"]},-\n'
        alarm_str = f'simple,1.3.6.1.4.1.12.1.1,0.3.0.2.7.7=90|0.3.0.2.7.13=3|1.3.6.1.4.1.12.2.1={task["object"]},{task["category"]},{task["name"]},cleared,{task["object"]},-\n'
        f = open(file_name, 'w', encoding='utf-8')
        f.write(alarm_str)
        f.close()
        path = os.path.abspath(file_name).encode('ascii') + b'\n'
        tl = TelnetClient(telnet_host, "", "", port=telnet_port)
        r = tl.connect(None)
        if r < 0:
            task["status"] = -1
            self.db_ins.update_item(task)
            return -1
        tl.exec(path)
        # tl = telnetlib.Telnet(telnet_host, telnet_port)
        # time.sleep(1)
        # tl.write(path)
        # command_result = tl.read_very_eager().decode('ascii')
        # time.sleep(5)
        tl.close()
        task["status"] = 1
        self.db_ins.update_item(task)
        return 1