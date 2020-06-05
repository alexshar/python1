
#! /usr/bin/env python3
import os
import threading
import time

# change this conf after deployed
#alarm_names_file_cn = 'samples/probableCauses'
alarm_names_file_en = '/usr/Systems/OTNE_1_19_Master/AS/conf/repository/locale/C.ISO-8859-1/probableCauses'
alarm_names_file_cn = '/usr/Systems/OTNE_1_19_Master/AS/conf/repository/locale/zh_CN.gb18030/probableCauses'

alarm_names_obj_cn = {}
alarm_names_obj_en = {}

# we take the assumption that the file do exist
def read_name_file():
    try:
        f = open(alarm_names_file_cn, 'r', encoding='gb18030')
        is_end = False
        index = 0
        while not is_end:
            raw_line = f.readline()
            if raw_line == '':
                is_end = True
            line_parts = raw_line.split('   ')
            if len(line_parts) == 2:
                key = line_parts[0]
                value = line_parts[1].split('\n')[0]
                index = index + 1
                alarm_names_obj_cn[key] = value
        f.close()
    except Exception as e:
        print("open Chinese alarm name file failed. ", e)

    try:
        f = open(alarm_names_file_en, 'r', encoding='utf-8')
        is_end = False
        index = 0
        while not is_end:
            raw_line = f.readline()
            if raw_line == '':
                is_end = True
            line_parts = raw_line.split('\t\t')
            if len(line_parts) == 2:
                key = line_parts[0]
                value = line_parts[1].split('\n')[0]
                index = index + 1
                alarm_names_obj_en[key] = value
        f.close()
    except Exception as e:
        print("open English alarm name file failed. ", e)

def write_name_file(lang):
    if lang == 'en':
        file_name = alarm_names_file_en
        objs = alarm_names_obj_en
        spliter = '\t\t'
        code = 'utf-8'
    else:
        file_name = alarm_names_file_cn
        objs = alarm_names_obj_cn
        spliter = '   '
        code = 'gb18030'
    f = open(file_name, 'w', encoding=code)
    for key in objs:
        f.write(key+spliter+objs[key]+'\n')
    f.close()

def init():
    read_name_file()

def get_all_alarm_names(lang):
    result = []
    if lang == 'en':
        items = alarm_names_obj_en
    else:
        items = alarm_names_obj_cn
    for item in items:
        result.append({ "key": item, "value": items[item]})
    return result

def update_alarm_names(data):
    if data['lang'] == 'en':
        objs = alarm_names_obj_en
    else:
        objs = alarm_names_obj_cn
    for item in data['data']:
        if item['key'] in objs:
            # print('update   ', item['key'], ':', item['value'])
            objs[item['key']] = item['value']
        else:
            objs[item['key']] = item['value']
            print('insert   ', item['key'], ':', item['value'])
    write_name_file(data['lang'])
    threading.Thread(target=restart_service, args=()).start()

def restart_service():
    time.sleep(0.5)
    print('stopping service 1')
    os.system('/usr/Systems/Global_Instance_19_Master/AS/script/StopFmCurUsmServ')
    print('stopping service 2')
    os.system('/usr/Systems/Global_Instance_19_Master/AS/script/StopFmHistUsmServ')
    print('stopping service 3')
    os.system('/usr/Systems/OTNE_1_19_Master/AS/script/StopFmHistUsmServ')
    print('stopping service 4')
    os.system('/usr/Systems/OTNE_1_19_Master/AS/script/StopFmCurUsmServ')
    print('starting service 1')
    os.system('/usr/Systems/Global_Instance_19_Master/AS/script/StartFmCurUsmServ')
    print('starting service 2')
    os.system('/usr/Systems/Global_Instance_19_Master/AS/script/StartFmHistUsmServ')
    print('starting service 3')
    os.system('/usr/Systems/OTNE_1_19_Master/AS/script/StartFmHistUsmServ')
    print('starting service 4')
    os.system('/usr/Systems/OTNE_1_19_Master/AS/script/StartFmCurUsmServ')
    print('[done]')

# 如果是改的英文文,执行
#     卸载告警中文包脚本
#     os.system(/aldsjflajdflakjdfl)


if __name__ == "__main__":
    init()

