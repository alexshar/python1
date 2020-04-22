import datetime
import calendar

def get_last_month_day(year, month):
    return calendar.monthlen(year, month)

def bin_stamp_2_obj(bin_stamp):
    year = int(bin_stamp / 1000000)
    month = int(bin_stamp % 1000000 / 10000)
    day = int(bin_stamp % 10000 / 100)
    return datetime.datetime(year, month, day)

if __name__ == "__main__":
    print(bin_stamp_2_obj(2020120313))