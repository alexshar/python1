import mysql_handler
import vars

def brief_pm():
    full_list = {}
    for type in vars.OBJ_TYPES.keys():
        list = mysql_handler.get_object_list(vars.OBJ_TYPES[type])
        n = len(list)
        name_list = [];
        for item in list:
            name_list.append(item[0])
        if len(name_list) > 0:
            print("数据库包括 %s 类型: %d个对象" % (type, n))
            print(name_list)
        full_list[type] = name_list
    return full_list

def get_object_history_pm_range(object_name, interval_type, pm_type):
    return mysql_handler.get_obj_data_time_range(object_name, interval_type, pm_type)