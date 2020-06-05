#! /usr/bin/env python3
import threading
import time
import logging

class Kronos(threading.Thread):
    '''
    This is a utility which running in a thread. It will check the registered
    database tables, and invoke the callback function once the execute time
    is reached.
    '''
    def __init__(self, step=15):
        threading.Thread.__init__(self)
        self.step = step
        self.isRunning = True
        self.watching_db_list = []
        self.locker = threading.Lock()

    def run(self):
        logging.info('Starting new scheduler thread ...')
        time.sleep(2)
        while self.isRunning:
            # get copy of watching database list
            self.locker.acquire()
            watching_db_list_copy = self.watching_db_list[:]
            self.locker.release()
            # get current timestamp (in ms)
            current = time.time() * 1000
            # scan
            for db in watching_db_list_copy:
                items = db["instance"].get_all_items()
                for item in items:
                    if item['execTime'] is None or item['execTime'] == "" or item['status'] != 0:
                        continue
                    exec_time = int(item['execTime'])
                    if current > exec_time:
                        logging.info(f"Scheduler executing [{db['name']}]: task-id={item['id']}")
                        db["callback"](item)
            # delay
            time.sleep(self.step)
        logging.info('Stopping scheduler thread ...')

    def register(self, db_name, db_instance, callback_fn):
        self.locker.acquire()
        self.watching_db_list.append({
            "name": db_name,
            "instance": db_instance,
            "callback": callback_fn
        })
        self.locker.release()

    def unregister(self, db_name):
        self.locker.acquire()
        for index in range(len(self.watching_db_list)):
            item_db_name = self.watching_db_list[index]["name"]
            if item_db_name == db_name:
                self.watching_db_list.pop(index)
                break
        self.locker.release()

    def stop(self):
        self.isRunning = False
    