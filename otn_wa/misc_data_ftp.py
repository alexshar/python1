#! /usr/bin/env python3

from ftplib import FTP
import os
import json

history_file = 'ftp_history.json'
db_file_base_path = '/alu/DEPOT/BackupJobs'

clean_log = {
        "Alarm": {},
        "PM": {},
        "Log": {},
        "Network": {},
        "SWDL": {},
        "SystemConfiguration": {},
        "Operator": {}
    }
log = None

def ftp_login(ip, user, password, port=21):
    try:
        ftp = FTP(ip)
        result = ftp.login(user=user, passwd=password)
    except:
        return -1
    else:
        return ftp

def ftp_upload(ip, port, user, password, file, remote_location, remote_name):
    if not os.path.exists(file):
        print(file, "does not exist")
        return -1
    ftp = ftp_login(ip, user, password, port)
    if ftp == -1:
        return -2
    ftp.cwd(remote_location)
    ftp.storbinary('stor ' + remote_name, open(file, 'rb'))
    ftp.close()
    return 1

def ftp_download(ip, port, user, password, file, remote_location, remote_name):
    ftp = ftp_login(ip, user, password, port)
    if ftp == -1:
        return "login failed"
    ftp.cwd(remote_location)
    ftp.retrbinary('retr ' + remote_name, open(file, 'wb').write)
    ftp.close()
    return 'OK'

def file_list():
    local_files = clean_log
    for item in os.listdir(db_file_base_path):
        # read folder name as item
        try:
            [category, bk_date, bk_time] = item.split("_")
        except Exception as e:
            continue
        
        if category == 'ALL':
            pass
        elif category == 'Alarm':
            pass
        elif category == 'PM':
            pass
        else:
            path = db_file_base_path + os.sep + item # "/alu/DEPOT/BackupJobs/alarm_20200415_163415"
            domain = os.listdir(path)
            if len(domain) == 0 or domain[0] == '':
                continue
            else:
                domain = domain[0]
                key = item+'@'+domain
            # "/alu/DEPOT/BackupJobs/alarm_20200415_163415/OTNE_1-19"
            path = path + os.sep + domain 
            # "/alu/DEPOT/BackupJobs/alarm_20200415_163415/OTNE_1-19/PM"
            path = path + os.sep + os.listdir(path)[0]
            # "/alu/DEPOT/BackupJobs/alarm_20200415_163415/OTNE_1-19/PM/SSotneVM1"
            path = path + os.sep + os.listdir(path)[0]
            # "/alu/DEPOT/BackupJobs/alarm_20200415_163415/OTNE_1-19/PM/SSotneVM1/PMDomain"
            path = path + os.sep + os.listdir(path)[0]
            file_name = os.listdir(path)
            if len(file_name) == 0 or file_name[0] == '':
                continue
            else:
                file_name = file_name[0]
            local_files[category][key] = {
                'key': key,
                'category': category,
                'abspath': path,
                'domain': domain,
                'date': f'{bk_date[0:4]}/{bk_date[4:6]}/{bk_date[6:8]} {bk_time[0:2]}:{bk_time[2:4]}:{bk_time[4:6]}',
                'file_name': file_name,
                'host': '',
                'remote_location': '',
                'remote_name': ''
            }

    history = get_history()
    local_files["Log"].update(history["Log"])
    local_files["Network"].update(history["Network"])
    local_files["SWDL"].update(history["SWDL"])
    local_files["SystemConfiguration"].update(history["SystemConfiguration"])
    local_files["Operator"].update(history["Operator"])
    return local_files

def get_history():
    f = open(history_file, 'r', encoding='utf-8')
    existing_items = json.loads(f.read())
    f.close()
    return existing_items

def put_history(logs):
    f = open(history_file, 'w', encoding='utf-8')
    f.write(json.dumps(logs, ensure_ascii=False, indent=4, separators=(',', ': ')))
    f.close()    

def file_upload(input):
    if 'host' not in input: return -1
    if 'port' not in input: return -2
    if 'user' not in input: return -3
    if 'password' not in input: return -4
    if 'abspath' not in input: return -5
    if 'filename' not in input: return -6
    if 'category' not in input: return -7
    if 'key' not in input: return -8
    if 'remote_location' not in input: return -9
    if 'remote_name' not in input: input['remote_name'] = input['filename']
    file_with_path = input['abspath'] + os.sep + input['filename']
    result = ftp_upload(input['host'], input['port'], input['user'], input['password'], file_with_path, input['remote_location'], input['remote_name'])
    if result == 1:
        log = file_list()
        log[input['category']][input['key']]['host'] = input['host']
        log[input['category']][input['key']]['remote_location'] = input['remote_location']
        log[input['category']][input['key']]['remote_name'] = input['remote_name']
        put_history(log)
        return 1
    return -10

def init():
    if not os.path.exists(history_file):
        print('No log file exists, creating new one ...', end = ' ')
        f = open(history_file, 'w', encoding='utf-8')
        f.write(json.dumps(clean_log, ensure_ascii=False, indent=4, separators=(',', ': ')))
        f.close()
        print(' done')
    log = file_list()
    put_history(log)

if __name__ == '__main__':
    init()
    # ftp = ftp_login(ip="10.242.111.231", user="root", password="roo2t")
    # if ftp == -1: print("login test case: pass")
    # print(ftp.cwd('/'))
    # print(ftp.retrlines('LIST'))
    print(file_list())
    # ftp_upload("10.242.111.231", '21', 'root', 'root', 'samples/probableCauses.s', '/root', 'test.txt')
