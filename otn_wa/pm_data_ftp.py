#! /usr/bin/env python3
# encoding: utf-8
from ftplib import FTP
import os
import json

pm_ftp_trace_file = 'ftp_trace.json'
pm_local_base_path = '/alu/DEPOT/BackupJobs'

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
        return "the file does not exist"
    ftp = ftp_login(ip, user, password, port)
    if ftp == -1:
        return "login failed"
    ftp.cwd(remote_location)
    ftp.storbinary('stor ' + remote_name, open(file, 'rb'))
    ftp.close()
    return 'OK'

def ftp_download(ip, port, user, password, file, remote_location, remote_name):
    ftp = ftp_login(ip, user, password, port)
    if ftp == -1:
        return "login failed"
    ftp.cwd(remote_location)
    ftp.retrbinary('retr ' + remote_name, open(file, 'wb').write)
    ftp.close()
    return 'OK'

def pm_upload(ip, port, user, password, file, remote_location, remote_name):
    existing = get_log()
    for item in existing:
        if item['key'] == file:
            file_path = item["abspath"]
            break
    [file_date, domain] = file.split('@')
    file_name = os.listdir(file_path)[0]
    result = ftp_upload(ip, port, user, password, file_path+os.sep+file_name, remote_location, remote_name)
    update_log(file, remote_location, remote_name, ip, port)
    return result

def pm_file_list():
    pm_local_files = []
    brief = []
    for item in os.listdir(pm_local_base_path):
        path = pm_local_base_path # "/alu/DEPOT/BackupJobs"
        if item[0:3] == 'PM_':
            date = item
            path = path + '/' + item # "/alu/DEPOT/BackupJobs/PM_20200415_163415"
            domain = os.listdir(path)
            if len(domain) == 0 or domain[0] == '':
                continue
            else:
                domain = domain[0]
            # "/alu/DEPOT/BackupJobs/PM_20200415_163415/OTNE_1-19"
            path = path + '/' + domain 
            # "/alu/DEPOT/BackupJobs/PM_20200415_163415/OTNE_1-19/PM"
            path = path + '/' + os.listdir(path)[0]
            # "/alu/DEPOT/BackupJobs/PM_20200415_163415/OTNE_1-19/PM/SSotneVM1"
            path = path + '/' + os.listdir(path)[0]
            # "/alu/DEPOT/BackupJobs/PM_20200415_163415/OTNE_1-19/PM/SSotneVM1/PMDomain"
            path = path + '/' + os.listdir(path)[0]
            file_name = os.listdir(path)
            if len(file_name) == 0 or file_name[0] == '':
                continue
            else:
                file_name = file_name[0]
            pm_local_files.append({
                'key': date + '@' + domain,
                'abspath': path,
                'domain': domain,
                'date': date,
                'file_name': file_name,
                'remote_location': '',
                'remote_name': '',
                'host': ''
            })
            print({
                'key': date + '@' + domain,
                'abspath': path,
                'domain': domain,
                'date': date,
                'file_name': file_name
            })
            brief.append(f"{date}@{domain}")
    update_log_by_local_files(pm_local_files)
    return brief

def get_pm_upload_log():
    f = open(pm_ftp_trace_file, 'r', encoding='utf-8')
    existing_items = json.loads(f.read())
    f.close()
    result = []
    for item in existing_items:
        result.append({
            'local_file': item['key'],
            'remote_location': item['remote_location'],
            'remote_name': item['remote_name'],
            'host': item['host']
        })
    return result

def get_log():
    f = open(pm_ftp_trace_file, 'r', encoding='utf-8')
    existing_items = json.loads(f.read())
    f.close()
    return existing_items

def update_log(file_key, remote_location, remote_name, ip, port):
    f = open(pm_ftp_trace_file, 'r', encoding='utf-8')
    existing_items = json.loads(f.read())
    f.close()
    for item in existing_items:
        if file_key == item['key']:
            item['remote_location'] = remote_location
            item['remote_name'] = remote_name
            item['host'] = ip
            break
    print(existing_items)
    f = open(pm_ftp_trace_file, 'w', encoding='utf-8')
    f.write(json.dumps(existing_items, ensure_ascii=False, indent=4, separators=(',', ': ')))
    f.close()

def update_log_by_local_files(local_files):
    f = open(pm_ftp_trace_file, 'r', encoding='utf-8')
    existing_items = json.loads(f.read())
    f.close()
    for file in local_files:
        is_existing_file = False
        for log_item in existing_items:
            if file['key'] == log_item['key']:
                is_existing_file = True
                break
        if not is_existing_file:
            existing_items.append(file)
    f = open(pm_ftp_trace_file, 'w', encoding='utf-8')
    f.write(json.dumps(existing_items, ensure_ascii=False, indent=4, separators=(',', ': ')))
    f.close()

def init():
    if not os.path.exists(pm_ftp_trace_file):
        print('No log file exists, creating new one ...', end = ' ')
        f = open(pm_ftp_trace_file, 'w', encoding='utf-8')
        f.write("[]")
        f.close()
        print('[done]')

if __name__ == '__main__':
    init()
    # ftp = ftp_login(ip="10.242.111.231", user="root", password="roo2t")
    # if ftp == -1: print("login test case: pass")
    # print(ftp.cwd('/'))
    # print(ftp.retrlines('LIST'))
    # pm_file_list()
    # ftp_upload("10.242.111.231", '21', 'root', 'root', 'samples/probableCauses.s', '/root', 'test.txt')
