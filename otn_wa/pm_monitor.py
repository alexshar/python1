#! /usr/bin/env python3
import os
import json
import threading
import time
import telnetlib

import requests

import config

pm_monitor_trace_file = 'monitor_trace.json'

base_url = f'{config.NSP_BASE_IP}:{config.NSP_PORT}'

url_consistpm = base_url + '/oms1350/pm/consistpm'  # example: 'https://135.251.96.98:8443/oms1350/pm/consistpm'
url_pmdata =    base_url + '/oms1350/pm/pmdata'

url_login = f'{config.NSP_BASE_IP}/cas/login'  # example: 'https://135.251.96.98/cas/login'
url_init0 = f'{config.NSP_BASE_IP}'
url_init1 = base_url + '/oms1350/pages/otn/mainOtn?initLocalStorage=true'
# url_test = 'https://localhost/xxxx'
username = config.NSP_USERNAME
password = config.NSP_PASSWORD

telnet_host = config.ALARM_INSERT_IP
telnet_port = config.ALARM_INSERT_PORT

def add_port(port_info):
    f = open(pm_monitor_trace_file, 'r', encoding='utf-8')
    existings = json.loads(f.read())
    f.close()

    port_name = port_info["name"]
    is_existing = False
    for port in existings:
        if port["name"] == port_name:
            is_existing = True
            port = port_info
            break
    if not is_existing:
        existings.append(port_info)
    
    f = open(pm_monitor_trace_file, 'w', encoding='utf-8')
    f.write(json.dumps(existings, ensure_ascii=False, indent=4, separators=(',', ': ')))
    f.close()

    if is_existing:
        return "updated"
    else:
        return "added"

def delete_port(port_name):
    f = open(pm_monitor_trace_file, 'r', encoding='utf-8')
    existings = json.loads(f.read())
    f.close()

    is_existing = False
    for index in range(len(existings)):
        if existings[index]["name"] == port_name:
            is_existing = True
            del existings[index]
            break
    if not is_existing:
        return "port not found, ignored"
    
    f = open(pm_monitor_trace_file, 'w', encoding='utf-8')
    f.write(json.dumps(existings, ensure_ascii=False, indent=4, separators=(',', ': ')))
    f.close()
    return "deleted"

def get_ports():
    f = open(pm_monitor_trace_file, 'r', encoding='utf-8')
    existings = json.loads(f.read())
    f.close()
    return existings

def write_ports(existings):
    f = open(pm_monitor_trace_file, 'w', encoding='utf-8')
    f.write(json.dumps(existings, ensure_ascii=False, indent=4, separators=(',', ': ')))
    f.close()

def insert_alarm(port):
    # 写出一个告警
    time_str = str(time.time())
    file_name = 'alarm'+time_str
    alarm_str = f'simple,1.3.6.1.4.1.12.1.1,0.3.0.2.7.7=90|0.3.0.2.7.13=3|1.3.6.1.4.1=1{time_str},communicationalarm,1.3.12.2.1006.57.3.11.35,warning,{port["name"]},-'
    f = open(file_name, 'w', encoding='utf-8')
    f.write(alarm_str)
    f.close()

    path = os.path.abspath(file_name).encode('ascii') + b'\n'
    tl = telnetlib.Telnet(telnet_host, telnet_port)
    time.sleep(1)
    tl.write(path)
    command_result = tl.read_very_eager().decode('ascii')
    time.sleep(5)
    tl.close()

class NspPmMonitor(threading.Thread):

    header = {
        "Accept": "application/json, text/plain, */*",
        "Cookie": "JSESSIONID=69FEA5D8DBAB8AA68FB12F6B95CAB8CA; NSPOS_JSESSIONID=07AB9187AD220C67BBE5A019C059D59B; BAYEUX_BROWSER=cede1thhrw1p7gl1vka4cwdxc14v2",
        "Content-Type": "application/json;charset=UTF-8"
    }
 
    def __init__(self):
        threading.Thread.__init__(self)
        if not os.path.exists(pm_monitor_trace_file):
            print('No NSP PM monitor trace exists, creating new...', end = ' ')
            f = open(pm_monitor_trace_file, 'w', encoding='utf-8')
            f.write("[]")
            f.close()
            print('[done]')
        
    def run(self):
        time.sleep(1)
        while True:
            ports = get_ports()
            if len(ports) > 0:
                self.login2()
                self.single_round(ports)
            time.sleep(60)

    def single_round(self, ports):
        temp = []
        print(f'开始扫描端口波长偏移，端口个数{len(ports)}')
        for port in ports:
            r = self.send_consistpm(port)
            r = self.send_pmdata(port)
            if r != 1:
                temp.append(port)
        # print(temp)
        write_ports(temp)

    def send_consistpm(self, port):
        consistpm_req_body = {
            "operationType":5,
            "connId":port["id"],
            "selectedEntities":port["id"]
        }
        r = self.session.post(url_consistpm, json=consistpm_req_body, verify=False)
        return r

    def send_pmdata(self, port):
        pmdata_req_body = port["monitorReq"]
        r = self.session.post(url_pmdata, json=pmdata_req_body, verify=False)
        result = json.loads(r.text)
        return self.compare(result["items"], port)

    def login(self):
        formdata = {
            "username": username,
            "password": password
        }
        r = requests.post(url_login, data=formdata, verify=False, headers={})
        set_cookie = r.headers.get("Set-Cookie")
        if set_cookie == None:     # 没有找到cookie
            return -1
        set_cookie = set_cookie.split(";")[0]
        # update Cookie
        self.header["Cookie"] = set_cookie

    def login2(self):
        formdata = {
            "username": username,
            "password": password,
            "_eventId": "submit",
            "geolocation": ""
        }
        headers = {
            # "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9"
        }
        self.session = requests.session()
        r = self.session.get(url_init0, verify=False)
        execution = r.content.splitlines()[25][53:]
        execution = execution[0: len(execution)-8]
        formdata["execution"] = execution
        r = self.session.post(url_login, data=formdata, verify=False, headers=headers)

    def compare(self, monitor, port):
        length = len(monitor)
        if length < 1:
            return -1
        threshold = port["threshold"]
        measure = monitor[len(monitor)-1]["pmData"]
        if float(measure["FOFFR(GHz)"]) > threshold["t"]\
        or float(measure["FOFFRH(GHz)"]) > threshold["th"]\
        or float(measure["FOFFRL(GHz)"]) > threshold["tl"]:
            print(f'触发告警: {port["name"]}')
            insert_alarm(port)
            return 1
        return -2


if __name__ == "__main__":
    pass

