#! /usr/bin/env python3
import os
import json
import threading
import time

import requests

pm_monitor_trace_file = 'monitor_trace.json'
url_consistpm = 'https://135.251.96.98:8443/oms1350/pm/consistpm'
url_pmdata = 'https://135.251.96.98:8443/oms1350/pm/pmdata'
url_login = 'https://135.251.96.98/cas/login'
url_test = 'https://localhost/xxxx'
username = 'alcatel'
password = 'Lucent3.#'

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
        self.login2()
        while True:
            self.single_round()
            time.sleep(60)

    def single_round(self):
        ports = get_ports()
        for port in ports:
            r = self.send_consistpm(port)
            r = self.send_pmdata(port)

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
        print(result)
        self.compare(result["items"], port)
        pass

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
        url_init0 = "https://135.251.96.98"
        url_init1 = "https://135.251.96.98:8443/oms1350/pages/otn/mainOtn?initLocalStorage=true"
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
            return
        threshold = port["threshold"]
        measure = monitor[len(monitor)-1]["pmData"]
        if float(measure["FOFFR(GHz)"]) > threshold["t"]\
        or float(measure["FOFFRH(GHz)"]) > threshold["th"]\
        or float(measure["FOFFRL(GHz)"]) > threshold["tl"]:
            # TODO: 
            print("触发告警！")


if __name__ == "__main__":
    m = NspPmMonitor()
    m.start()

