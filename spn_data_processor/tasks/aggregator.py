import datetime
import mysql_handler
import vars
import utils.time

def aggregate_single_obj_month(obj, obj_type, pm_type, year, month):
    begin_date = datetime.datetime(year, month, 1, 0, 0, 0, 0);
    end_date = datetime.datetime(year, month, utils.time.get_last_month_day(year, month), 23, 59, 59, 999)
    pass

