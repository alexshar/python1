#! /usr/bin/env python3
import requests

from util.litchi import Litchi as DB
from remote_console.ssh_client import SSHClient 
from remote_console.telnet_client import TelnetClient

import config

class Loopback:

    def __init__(self, scheduler_ins):
        self.db_name = 'loopback_release'
        self.db_ins = DB(self.db_name)
        scheduler_ins.register(self.db_name, self.db_ins, self.release_loopback)
    
    def login_NSP(self):
        username = config.NSP_USERNAME
        password = config.NSP_PASSWORD
        url_init0 = f'{config.NSP_BASE_IP}'
        url_login = f'{config.NSP_BASE_IP}/cas/login'
        formdata = {
            "username": username,
            "password": password,
            "_eventId": "submit",
            "geolocation": ""
        }
        headers = { }
        self.session = requests.session()
        r = self.session.get(url_init0, verify=False)
        execution = r.content.splitlines()[25][53:]
        execution = execution[0: len(execution)-8]
        formdata["execution"] = execution
        r = self.session.post(url_login, data=formdata, verify=False, headers=headers)
        pass

    def send_release_loopback_via_NSP(self, item):
        portId = item['portId']
        id = portId
        if item['type'] == 'Cmd_Facility_Loopback':
            loopback_type = 'FACILITY'
        else:
            loopback_type = "TERMINAL"
        layerRateId = item['layerRateId']
        neId = item['neId']
        tpDisplayLabel = item['tpDisplayLabel']
        neName = item['neName']
        # build url with parameters
        # sample = '?loopbackCommandName=PerformRelease&portLoopbackType=FACILITY&layerRateId=20&neId=46&tpDisplayLabel=130SCX10-1-5-L1&portId=123564&neName=pss32-152'
        base = f'{config.NSP_BASE_IP}:{config.NSP_PORT}/oms1350/data/otn/ports/{id}/loopback' 
        param = f'?loopbackCommandName=PerformRelease&portLoopbackType={loopback_type}&layerRateId={layerRateId}&neId={neId}&tpDisplayLabel={tpDisplayLabel}&portId={portId}&neName={neName}'
        url_release_loopback = base + param
        print(url_release_loopback)
        consistpm_req_body = { "Tag": "Cmd_Release_Loopback" }
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.61 Safari/537.36"
        }
        r = self.session.post(url_release_loopback, json=consistpm_req_body, verify=False, headers=headers)
        print(r.text)
        pass

    def send_release_loopback_via_vcli(self, item):
        ip = item["neIp"]
        label = item["tpDisplayLabel"].split("-", 1)[1].replace('-', '/')
        "aaaxxx".split()
        client = SSHClient(ip, 'root', 'ALu12#')
        if client is None: return -102
        client.connect()
        r = client.exec_batch([
            ('vsim cli\n', 'Username: '),
            ('admin\n', 'Password: '),
            ('admin\n', '(Y/N)?'),
            ('Y\n', "# "),
            (f'config interface {label} loopback facility disable\n', "# "),
            (f'config interface {label} loopback terminal disable\n', "# ")
        ])
        pass

    def send_release_loopback_via_cli(self, item):
        pass

    def release_loopback(self, task):
        print(task)
        # self.login_NSP()
        for item in task['items']:
            self.send_release_loopback_via_vcli(item)

        self.db_ins.delete_item_by_id(str(task['id']))
        
    def add_loopback_release_task(self, task):
        return self.db_ins.add_item(task)

    def get_all_tasks(self):
        return self.db_ins.get_all_items()