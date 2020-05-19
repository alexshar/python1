#! /usr/bin/env python3
import time
import json
import os
import threading

#import telnetlib
#http://docs.paramiko.org/en/stable/api/client.html
#import paramiko

import util.litchi


class CutOverManage(threading.Thread):
    
    db = util.litchi.Litchi('cutover_task')

    def __init__(self):
        super().__init__()

    def update_task(self, port):
        return self.db.add_update_item(port)

    def delete_task(self, id):
        return self.db.delete_item_by_id(id)

    def get_all_tasks(self):
        return self.db.get_all_items()


    def run(self):
        time.sleep(1)
        while True:
            tasks = self.db.get_all_items()
            time.sleep(300)