#! /usr/bin/env python3
import threading
import json
import os

'''
This is a class to store objects to file, like MongoDB. 
It is called Litchi-DB.
''' 
class Litchi():

    db_file_name = ""
    write_look = threading.Lock()
    id_counter = 0
    items = []

    def __init__(self, db_name):
        self.db_file_name = db_name + ".ldb"
        if not os.path.exists(self.db_file_name):
            print('Creating new data file ...', end = ' ')
            f = open(self.db_file_name, 'w', encoding='utf-8')
            f.write("[]")
            f.close()
            print(' done')
        else:
            f = open(self.db_file_name, 'r', encoding='utf-8')
            self.items = json.loads(f.read())
            f.close()
        
        self.__init_id_counter()

    def __init_id_counter(self):
        max = 0
        for item in self.items:
            temp_id = int(item["id"])
            if temp_id > max:
                max = temp_id
        self.id_counter = max

    def __generate_new_id(self):
        self.id_counter = self.id_counter + 1
        return self.id_counter

    def __write_items(self):
        f = open(self.db_file_name, 'w', encoding='utf-8')
        f.write(json.dumps(self.items, ensure_ascii=False, indent=4, separators=(',', ': ')))
        f.close()        

    def add_update_item(self, item):
        return self.update_item(item)

    def add_item(self, item):
        self.write_look.acquire()
        item["id"] = self.__generate_new_id()
        self.items.append(item)
        self.__write_items()
        self.write_look.release()
        return item["id"]

    def get_all_items(self):
        return self.items

    def delete_item_by_id(self, id):
        self.write_look.acquire()
        for index in range(len(self.items)):
            if id == str(self.items[index]["id"]):
                self.items.pop(index)
                self.__write_items()
                self.write_look.release()
                return id
        # if none of the items has the same id, return -1
        self.write_look.release()
        return -1

    def update_item(self, item):
        if item["id"] is None or item["id"] == "":
            return self.add_item(item)
        for index in range(len(self.items)):
            if item["id"] == self.items[index]["id"]:
                self.write_look.acquire()
                self.items[index] = item
                self.__write_items()
                self.write_look.release()
                return item["id"]
        # if none of the items has the same id, add the item as new
        return self.add_item(item)



    
