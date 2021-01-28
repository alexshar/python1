#! /usr/bin/env python3
import os
import json
import logging

from flask import Flask, abort, request, jsonify
from flask_cors import CORS

from util.kronos import Kronos as Scheduler
import config
import alarm_names
import pm_data_ftp, alarm_data_ftp
import enms_db
import pm_monitor
import cutover
import misc_data_ftp
from loopback import Loopback
from bandwidth_adjust import BandwidthAdjust
from smart_service import SmartService

app = Flask(__name__)
CORS(app, resources=r'/*')

@app.route('/', methods=['GET'])
def root_page():
    return (f'<html><meta http-equiv="refresh" content="0;url={config.NSP_BASE_IP}"></html>')

@app.route('/ftp_upload', methods=['POST'])
def ftp_upload():
    if not request.json:
        abort(500)
    if 'ip' not in request.json \
        or 'user' not in request.json \
        or 'password' not in request.json \
        or 'remote_location' not in request.json \
        or 'remote_name' not in request.json \
        or 'file' not in request.json:
        abort(501)
    print(request.json)
    return pm_data_ftp.ftp_upload(
        request.json['ip'],
        request.json['port'],
        request.json['user'],
        request.json['password'],
        request.json['file'],
        request.json['remote_location'],
        request.json['remote_name']
    )

@app.route('/pm_upload', methods=['POST'])
def pm_upload():
    if not request.json:
        abort(500)
    if 'ip' not in request.json \
        or 'user' not in request.json \
        or 'password' not in request.json \
        or 'remote_location' not in request.json \
        or 'remote_name' not in request.json \
        or 'file' not in request.json:
        abort(501)
    print(request.json)
    return pm_data_ftp.pm_upload(
        request.json['ip'],
        request.json['port'],
        request.json['user'],
        request.json['password'],
        request.json['file'],
        request.json['remote_location'],
        request.json['remote_name']
    )

@app.route('/alarm_upload', methods=['POST'])
def alarm_upload():
    if not request.json:
        abort(500)
    if 'ip' not in request.json \
        or 'user' not in request.json \
        or 'password' not in request.json \
        or 'remote_location' not in request.json \
        or 'remote_name' not in request.json \
        or 'file' not in request.json:
        abort(501)
    print(request.json)
    return alarm_data_ftp.alarm_upload(
        request.json['ip'],
        request.json['port'],
        request.json['user'],
        request.json['password'],
        request.json['file'],
        request.json['remote_location'],
        request.json['remote_name']
    )

@app.route('/pm_download', methods=['POST'])
def pm_download():
    if not request.json:
        abort(500)
    if 'ip' not in request.json \
        or 'user' not in request.json \
        or 'password' not in request.json \
        or 'remote_location' not in request.json \
        or 'remote_name' not in request.json \
        or 'file' not in request.json:
        abort(501)
    return pm_data_ftp.ftp_download(
        request.json['ip'],
        request.json['port'],
        request.json['user'],
        request.json['password'],
        request.json['file'],
        request.json['remote_location'],
        request.json['remote_name']
    )

@app.route('/pm_tables', methods=['GET'])
def pm_collections():
    if not request.args or 'file' not in request.args:
        abort(500)
    return jsonify(enms_db.get_pm_collections())

@app.route('/pm_table', methods=['GET'])
def pm_collection():
    if not request.args\
        or 'file' not in request.args\
        or 'table' not in request.args\
        or 'page' not in request.args\
        or 'page_size' not in request.args:
        abort(500)
    return jsonify(enms_db.get_pm_collection(
        request.args['table'], 
        request.args['file'],
        int(request.args['page']),
        int(request.args['page_size'])
    ))

@app.route('/alarm_tables', methods=['GET'])
def alarm_collections():
    if not request.args or 'file' not in request.args:
        abort(500)
    return jsonify(enms_db.get_alarm_collections())

@app.route('/alarm_table', methods=['GET'])
def alarm_collection():
    if not request.args\
        or 'file' not in request.args\
        or 'table' not in request.args\
        or 'page' not in request.args\
        or 'page_size' not in request.args:
        abort(500)
    return jsonify(enms_db.get_alarm_collection(
        request.args['table'],
        request.args['file'],
        int(request.args['page']),
        int(request.args['page_size'])
    ))


@app.route('/pm_files', methods=['GET'])
def get_pm_files():
    return jsonify(pm_data_ftp.pm_file_list())

@app.route('/pm_upload_logs', methods=['GET'])
def get_pm_upload_logs():
    return jsonify(pm_data_ftp.get_pm_upload_log())

@app.route('/pm_upload_logs_detail', methods=['GET'])
def get_pm_upload_logs_detail():
    return jsonify(pm_data_ftp.get_log())

@app.route('/alarm_files', methods=['GET'])
def get_alarm_files():
    return jsonify(alarm_data_ftp.alarm_file_list())

@app.route('/alarm_upload_logs', methods=['GET'])
def get_alarm_upload_logs():
    return jsonify(alarm_data_ftp.get_alarm_upload_log())

@app.route('/alarm_upload_logs_detail', methods=['GET'])
def get_alarm_upload_logs_detail():
    return jsonify(alarm_data_ftp.get_log())

'''
告警名字的修改
'''
@app.route('/alarm_names', methods=['PUT', 'GET'])
def put_alarm_names():
    if request.method == 'PUT':
        if not request.json:
            abort(500)
        alarm_names.update_alarm_names(request.json)
        return 'OK'
    elif request.method == 'GET':
        if not request.args or 'lang' not in request.args:
            abort(500)
        return jsonify(alarm_names.get_all_alarm_names(request.args['lang']))

# 激活语言包
@app.route('/active_alarm_lang', methods=['POST'])
def active_alarm_lang():
    if not request.json or 'lang' not in request.json:
        abort(500)
    alarm_names.active_lang(request.json["lang"])
    return "OK"

'''
Wave Shift 波长偏移
'''
@app.route('/shift_monitor', methods=['POST', 'DELETE', 'GET'])
def shift_monitor():
    if request.method == 'POST':
        if not request.json:
            abort(500)
        return jsonify(pm_monitor.add_port(request.json))
        
    elif request.method == 'DELETE':
        if not request.args or 'port' not in request.args:
            abort(500)
        return jsonify(pm_monitor.delete_port(request.args["port"]))

    elif request.method == 'GET':
        return jsonify(pm_monitor.get_ports())

'''
Cut Over 割接
cutover_task_ins = cutover.CutOverManage()
'''
@app.route('/cutover_task', methods=['GET', 'POST', 'DELETE'])
def cutover_task():
    if request.method == 'GET':
        return jsonify(cutover_task_ins.get_all_tasks())
    if request.method == 'POST':
        if not request.json:
            abort(500)
        return jsonify(cutover_task_ins.update_task(request.json))
    if request.method == 'DELETE':
        if not request.args or 'id' not in request.args:
            abort(500)
        return jsonify(cutover_task_ins.delete_task(request.args["id"]))

@app.route('/cutover_exec', methods=['POST'])
def cutover_exec():
    if not request.json:
        abort(500)
    return jsonify(cutover_task_ins.exec_tasks_by_id(request.json["id"], request.json["isRollback"]))

'''
其他文件ftp
'''
# 被动模式的模块
misc_data_ftp.init()

@app.route("/get_db_backups", methods=['GET'])
def get_db_backups():
    return jsonify(misc_data_ftp.refresh())

@app.route('/file_upload', methods=['POST'])
def file_upload():
    if not request.json:
        abort(500)
    r = misc_data_ftp.file_upload(request.json)
    if r < 0:
        logging.warning("return error=", r)
        abort(501)
    return jsonify("OK")

'''
环回撤销登记
'''
@app.route('/loopback_release', methods=['GET', 'POST'])
def loopback_release():
    if request.method == 'GET':
        return jsonify(loopback_ins.get_all_tasks())
    if request.method == 'POST':
        if not request.json:
            abort(500)
        return jsonify(loopback_ins.add_loopback_release_task(request.json))

'''
带宽调整
'''
@app.route('/bw_adj', methods=['GET', 'POST'])
def bandwidth_adjust():
    if request.method == 'GET':
        return jsonify(bandwidth_adjust_ins.get_all_items())
    if request.method == 'POST':
        if not request.json:
            abort(500)
        return jsonify(bandwidth_adjust_ins.add_item(request.json))

'''
智能业务
'''
@app.route('/setup_service', methods=['POST'])
def setup_service():
    if not request.json:
        abort(400)
    s, r = smart_service_ins.setup_service(request.json)
    if s < 0:
        abort(400, r)
    return jsonify(r)

@app.route('/get_service_list', methods=['GET'])
def get_service_list():
    return jsonify(smart_service_ins.get_all_service())

if __name__ == "__main__":
    # init logger
    logging_format = "[%(asctime)s] %(filename)s[:%(lineno)d] %(message)s"
    logging.basicConfig(level=logging.DEBUG, format=logging_format)
    
    alarm_names.init()
    pm_data_ftp.init()
    alarm_data_ftp.init()

    schduler_ins = Scheduler()
    schduler_ins.start()

    waveshift_ins = pm_monitor.NspPmMonitor()
    waveshift_ins.start()

    cutover_task_ins = cutover.CutOverManage()
    cutover_task_ins.start()

    # 为环回添加调度器服务
    loopback_ins = Loopback(schduler_ins)

    bandwidth_adjust_ins = BandwidthAdjust()

    smart_service_ins = SmartService()

    # 将host设置为0.0.0.0，则外网用户也可以访问到这个服务
    app.run(host="0.0.0.0", port=5031, debug=False, ssl_context='adhoc')
    waveshift_ins.join()
    schduler_ins.join()