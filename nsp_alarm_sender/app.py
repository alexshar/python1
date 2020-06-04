#! /usr/bin/env python3
from flask import Flask, abort, request, jsonify, render_template
from alarm_handler import AlarmInsert
from util.kronos import Kronos

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_alarms', methods=['GET'])
def get_alarms():
    return jsonify(alarm_handler_ins.get_tasks())

@app.route('/alarm', methods=['POST', 'DELETE'])
def alarm():
    # add new alarm
    if request.method == 'POST':
        if not request.json:
            abort(500)
        return alarm_handler_ins.add_task(request.json)
    # delete the task 
    if request.method == 'DELETE':
        if not request.args or 'id' not in request.args:
            abort(500)
        return alarm_handler_ins.delete_task_by_id(request.args["id"])
        
@app.route('/alarm_exec', methods=['POST'])
def alarm_exec():
    if not request.json:
        abort(500)
    return jsonify(alarm_handler_ins.insert_alarm(request.json))

if __name__ == '__main__':
    scheduler_ins = Kronos()
    scheduler_ins.start()
    alarm_handler_ins = AlarmInsert(scheduler_ins)
    app.run(debug=False, host='0.0.0.0', port=6031)