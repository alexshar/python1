#! /usr/bin/env python3

from flask import Flask, abort, request, jsonify
from flask_cors import CORS
import os
import json

import alarm_names
import pm_data_ftp, alarm_data_ftp
import enms_db

app = Flask(__name__)
CORS(app, resources=r'/*')

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

@app.route('/shift_monitor', methods=['POST', 'DELETE', 'GET'])
def shift_monitor():
    if request.method == 'POST':
        if not request.json:
            abort(500)
        return "OK"
        
    elif request.method == 'DELETE':
        if not request.args or 'port' not in request.args:
            abort(500)
        return "OK"

    elif request.method == 'GET':
        return jsonify([{"name": "foobar"}])

if __name__ == "__main__":
    alarm_names.init()
    pm_data_ftp.init()
    alarm_data_ftp.init()
    # 将host设置为0.0.0.0，则外网用户也可以访问到这个服务
    app.run(host="0.0.0.0", port=5031, debug=True, ssl_context='adhoc')