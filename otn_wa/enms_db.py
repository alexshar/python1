#! /usr/bin/env python3
import pymongo
import json
import datetime
import time

import config

db_host = config.ENMS_DB_ADDRESS

def init_target_db(db_name):
    client = pymongo.MongoClient(db_host)
    db_list = client.list_database_names()
    if db_name in db_list:
        return client[db_name], client
    else:
        client.close()
        return None, None

def get_pm_collections():
    db, client = init_target_db('pm')
    if db == None:
        return []
    client.close()
    return db.list_collection_names()

def get_alarm_collections():
    return ["alarm_current", "alarm_history"]

# translate "PM_20200415_163415@OTNE_1-19" to timestamp
def get_timestamp(input_symbol):
    result = 1586968455000 # 2020/04/15 16:34:15 UK
    try:
        date_str = input_symbol.split("_")[1]
        time_str = input_symbol.split("_")[2]
        year   = int(date_str[0:4])
        month  = int(date_str[4:6])
        day    = int(date_str[6:8])
        hour   = int(time_str[0:2])
        minute = int(time_str[2:4])
        second = int(time_str[4:6])
    except:
        print("user default time: 1589560455000")
        return result
    t = int(datetime.datetime(year, month, day, hour, minute, second).timestamp()*1000)
    # the symbol was recorded as UTC, there is 8-hour gap
    return t + 8 * 3600 * 1000

# make the json object the flat&paint line:
def json_to_line(obj):
    result = {}
    for key in obj:
        if isinstance(obj[key], datetime.datetime):
            #result[key] = f"{obj[key].year}-{obj[key].month}-{obj[key].day} {obj[key].hour}:{obj[key].minute}:{obj[key].second}"
            result[key] = obj[key].isoformat()
        elif type(obj[key]) is dict:
            append_dict(target_dict=result, prefix=key, source_dict=obj[key])
        else:
            result[key] = obj[key]
    return result

def append_dict(target_dict, prefix, source_dict):
    for key in source_dict:
        target_key = f"{prefix}/{key}"
        if isinstance(source_dict[key], datetime.datetime):
            target_dict[target_key] = source_dict[key].isoformat()
        elif type(source_dict[key]) is dict:
            append_dict(target_dict, target_key, source_dict[key])
        else:
            target_dict[target_key] = source_dict[key]

'''
return the collection documents like: {
    "count": 129262,
    "page": 1,
    "page_size": 100
    "data": [
        {
            "_id": "5e1ee3c632d0bb5c044625a3",
            "tpid": "5e1dd6ad4b3d746ded862fae_17105920",
            "tpUserLabel": "AHPLG-1-5-LINE",
            "granularity": 0,
            "bin": 1,
            "endTimeEpoch": 1579139100000,
            "endTime": "2020-01-16T01:45:00",
            "neUserLabel": "201",
            "neid": "5e1dd6ad4b3d746ded862fae",
            "groups/tnOpInStat/sBinStatus": "dataComplete",
            "groups/tnOpInStat/counters/MaxPower": "-1029",
            "groups/tnOpInStat/counters/AveragePower": "-1032",
            "groups/tnOpInStat/counters/MinPower": "-1034",
            "groups/tnOpOutStat/sBinStatus": "dataComplete",
            "groups/tnOpOutStat/counters/MaxPower": "-4000",
            "groups/tnOpOutStat/counters/AveragePower": "-9990",
            "groups/tnOpOutStat/counters/MinPower": "-4000",
            "params/neNumber": 10002
        }
    ]
}
'''
def get_pm_collection(collection_name, time_symbol=0, page=1, page_size=100):
    timestamp = get_timestamp(time_symbol)
    db, client = init_target_db('pm')
    collection = db[collection_name]
    f = {"endTimeEpoch": {'$lte': timestamp}}
    total = collection.count_documents(f)
    items = collection.find(f).skip((page-1)*page_size).limit(page_size)
    result = {
        "count": total,
        "page": page,
        "page_size": page_size,
        "data": []
    }
    for raw_item in items:
        # start to convert json-like objects to table-lines
        item = json_to_line(raw_item)
        result['data'].append(item)
    pass
    # close DB
    client.close()
    time.sleep(4)
    return result

# Alarm_20200419_110606@OTNE_1-19
def get_alarm_collection(table_name, time_symbol=0, page=1, page_size=20):
    collection_name = table_name.replace("_", ".")
    timestamp = get_timestamp(time_symbol)
    db, client = init_target_db("controller_V2")
    collection = db[collection_name]
    f = {"neRaiseTime": {'$lte': timestamp}} # 1591693993466
    total = collection.count_documents(f)
    items = collection.find(f).skip((page-1)*page_size).limit(page_size)
    result = {
        "count": total,
        "page": page,
        "page_size": page_size,
        "data": []
    }
    for raw_item in items:
        # start to convert json-like objects to table-lines
        item = json_to_line(raw_item)
        result['data'].append(item)
    pass
    # close DB
    client.close()
    time.sleep(4)
    return result    

if __name__ == "__main__":
    # let's try to read Pm_History_5e1dd6ad4b3d746ded862fae
    # backup_file = "PM_20200415_163415@OTNE_1-19"
    # print(get_timestamp(backup_file))
    # collection_name = 'Pm_History_5e1dd6ad4b3d746ded862fae'
    # result = get_pm_collection(collection_name, time_symbol=backup_file, page=2, page_size=1)
    # print(json.dumps(result, ensure_ascii=False, indent=4))
    backup_file = "Alarm_20200419_110606@OTNE_1-19"
    print(get_timestamp(backup_file))
    collection_name = 'alarm_current'
    result = get_alarm_collection(collection_name, time_symbol=backup_file, page=2, page_size=2)
    print(json.dumps(result, ensure_ascii=False, indent=4))
