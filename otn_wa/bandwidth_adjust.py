#! /usr/bin/env python3
import logging
from util.litchi import Litchi as DB

class BandwidthAdjust:

    def __init__(self):
        self.db_name = 'bw_adj'
        self.db_ins = DB(self.db_name)
    
    def add_item(self, item):
        return self.db_ins.add_update_item(item)

    def get_all_items(self):
        return self.db_ins.get_all_items()