#coding:utf-8
import datetime
import mysql.connector
import vars

DB = mysql.connector.connect(
    host="10.242.111.231",
    user="root",
    passwd="root",
    database="spn"
)

def print_records(input):
    if len(input) == 0:
        print("没有记录")
    else:
        print("共%d条记录:" % (len(input)))
    for item in input:
        print(item)

def sql_exec(exec_string):
    mycursor = DB.cursor()
    mycursor.execute(exec_string)
    return mycursor.fetchall()

def get_obj_data_time_range(object_name, interval_type, pm_type):
    table_name = "historypm"
    sql_string = "SELECT min(year*1000000+month*10000+day*100+bin) as earliest, max(year*1000000+month*10000+day*100+bin) as latest FROM %s WHERE objectName='%s' AND pmType=%d AND intervalType=%d" \
        % (table_name, object_name, pm_type, interval_type)
    
    result = sql_exec(sql_string);
    if len(result) > 0:
        result = result[0]
    else:
        return (), ()

    datetime.datetime()

def get_data(pm_type, interval_type, object_type, begin_date, end_date):
    table_name = "historypm"
    sql_string = "SELECT objectName, year, month, day, bin, max, min, avg FROM %s WHERE objectType=%d AND pmType=%d AND intervalType=%d" \
        % (table_name, object_type, pm_type, interval_type)

    if begin_date != ():
        begin_year = begin_date.year
        begin_month = begin_date.month
        begin_day = begin_date.day
        begin_bin = int((begin_date.hour * 60 + begin_date.minute) / 15) + 1
        begin_value = begin_year * 100 * 100 * 100 + begin_month * 100 * 100 + begin_day * 100 + begin_bin
        begin_string = "year*1000000 + month*10000+day*100+bin >= " + str(begin_value)
        sql_string = sql_string + " AND " + begin_string

    if end_date != ():
        end_year = end_date.year
        end_month = end_date.month
        end_day = end_date.day
        end_bin = int((end_date.hour * 60 + end_date.minute) / 15) + 1
        end_value = end_year * 100 * 100 * 100 + end_month * 100 * 100 + end_day * 100 + end_bin
        end_string = "year*1000000 + month*10000+day*100+bin <= " + str(end_value)
        sql_string = sql_string + " AND " + end_string

    print(sql_string)
    result = sql_exec(sql_string)
    print_records(result)
    return result

def get_object_list(object_type, pm_type=-1, interval_type=-1):
    table_name = "historypm"
    sql_string = "SELECT objectName FROM %s WHERE objectType=%d" \
        % (table_name, object_type)
    
    if pm_type != -1:
        sql_string = sql_string + "AND pmType=" + str(pm_type)
    if interval_type != -1:
        sql_string = sql_string + "AND intervalType=" + str(interval_type)
    sql_string = sql_string + " GROUP BY objectName"

    # print(sql_string)
    result = sql_exec(sql_string)
    # print_records(result)
    return result

def put_():
    pass

if __name__ == "__main__":
    # case 1
    begin = datetime.datetime(2020, 2, 1, 0, 0, 0)
    end = datetime.datetime(2020, 12, 2, 23, 59, 59)
    pm_type = vars.PM_TYPES['flowrate']
    interval_type = vars.INTERVAL_TYPES['day']
    object_type = vars.OBJ_TYPES['pw']
    #result = get_data(pm_type, interval_type, object_type, begin, end)
    
    # case 2
    result = get_object_list(object_type, pm_type, interval_type)
