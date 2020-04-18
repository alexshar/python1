#! /usr/bin/env python3
# encoding: utf-8
import argparse
import os
import xlrd
import json

def print_obj(obj):
    print(obj)

def print_obj_beautified(obj):
    print(obj)

def aoa_to_obj(aoa, has_header=True):
    if len(aoa) < 1:
        return []
    # 没有第一行作表头就混不下去了
    if has_header:
        keys = aoa[0]
        max_index = len(keys)
    else:
        return []
    # 开始解析
    result = []
    for line in aoa[1:]:
        obj = {}
        for index in range(len(line)):
            if index >= max_index:
                break
            if keys[index] == None or keys[index] == '':
                continue
            obj[keys[index]] = line[index]
        result.append(obj)
    return result

def read_excel_file(file_name):
    print('opening file:\t' + file_name)
    workbook = xlrd.open_workbook(file_name)
    sheets = workbook.sheets()
    data = []
    for sheet in sheets:
        content = { 'name': sheet.name }
        content['content'] = sheet._cell_values
        content['ncols'] = sheet.ncols
        content['nrows'] = sheet.nrows
        data.append(content)
    return data

#如果文件存在，返回绝对路径，否则返回空字符串
def check_file_name(file_name):
    if os.path.exists(file_name):
        dir = os.path.abspath(file_name)
        return dir
    else:
        return ''

def to_json(input_file_name, output_file_name, beautify):
    # 检查输入文件路径
    excel_file_name = check_file_name(input_file_name)
    if excel_file_name == '':
        print('Error: Excel file does not exist')
        return
    # 输入文件路径
    json_file_name = os.path.abspath(output_file_name)
    # 读取Excel文件
    raw = read_excel_file(excel_file_name)
    obj = aoa_to_obj(raw[0]['content'])
    if beautify:
        jstr = json.dumps(obj, ensure_ascii=False, indent=4, separators=(',', ': '))
    else:
        jstr = json.dumps(obj, ensure_ascii=False)
    #print(jstr)
    f = open(json_file_name,'w',encoding='utf-8')
    f.write(jstr)
    print('write to: \t' + json_file_name)
    f.close()

def to_excel(input_file_name, output_file_name):
    pass

def parse_args():
    parser = argparse.ArgumentParser(description='Convert an Excel file to JSON file')
    parser.add_argument('Excel_file_name', metavar='Excel_file', help='the input Excel file''s name')
    parser.add_argument('JSON_file_name', metavar='JSON_file', help='the output JSON file''s name')
    parser.add_argument('-r', '--reverse', action='store_true', help="convert an JSON file to Excel file mode")
    parser.add_argument('-b', '--beautify', action='store_true', help="the output JSON will be formatted")
    args = parser.parse_args()
    return (args.Excel_file_name, args.JSON_file_name, args.reverse, args.beautify)

if __name__ == "__main__":
    excel_file_name, json_file_name, reverse, beautify = parse_args()
    if reverse:
        to_excel(json_file_name, excel_file_name)
    else:
        to_json(excel_file_name, json_file_name, beautify)
    
