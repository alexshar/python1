import mysql_handler

def list_connections():
    exec_string = "select objectName from historypm where objectType=1 group by objectName"
    result = mysql_handler.sql_exec(exec_string)
    return result

def aggregate_month(year, month):
    pass

connections = list_connections()
for item in connections:
    object_name = item[0]

