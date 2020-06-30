#! /usr/bin/env python3
import logging
from flask import Flask, abort, request, jsonify, Response
from flask_cors import CORS
from remote_console.ssh_client import SSHClient

app = Flask(__name__)
CORS(app, resources=r'/*')

client = None
session_max = 0

@app.route('/connect', methods=['POST'])
def connect_ssh():
    global client
    logging.debug(request.json)
    if not request.json or "host" not in request.json or "username" not in request.json or "password" not in request.json:
        abort(400, "parameters wrong")
    host = request.json["host"]
    username = request.json["username"]
    password = request.json["password"]
    port = 22
    if "port" in request.json: 
        port = request.json["port"]
    client = SSHClient(host, username, password, port)
    if client == None:
        abort(500, "create SSH client error")
    r, msg = client.connect()
    if r < 0:
        abort(500, "connection error")
    session_max = 1
    return jsonify({
      "sessionID": session_max,
      "welcome": msg
    })

@app.route('/execute', methods=['POST'])
def exec_command():
    global client
    if not request.json or "sessionId" not in request.json or "command" not in request.json:
        abort(400, "parameters wrong")
    if client is None:
        abort(Response("SSH connection has not been established"))
    r, msg = client.exec(request.json["command"], "# ")
    return jsonify({
      "msg": msg
    })

@app.route('/close', methods=['POST'])
def close_ssh():
    global client
    if not request.json or "sessionId" not in request.json:
        abort(400, "parameters wrong")
    if client is not None:
        client.close()
    return jsonify({})

if __name__ == "__main__":
    # init logger
    logging_format = "[%(asctime)s] %(filename)s[:%(lineno)d] %(message)s"
    logging.basicConfig(level=logging.DEBUG, format=logging_format)

    # 将host设置为0.0.0.0，则外网用户也可以访问到这个服务
    app.run(host="0.0.0.0", port=5031, debug=False)
