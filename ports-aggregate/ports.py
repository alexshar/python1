from math import sqrt
import random

def gen():
    # this is a configurable parameter, density
    region_num = random.randint(5, 20)
    regions = []
    for i in range(region_num):
        region_begin = random.randint(1, 65534)
        region_length = random.randint(30,4000)
        region_end = region_begin + region_length
        if region_end > 65535: region_end = 65535
        regions.append((region_begin, region_end))

    s = []
    # 以1为中心把均匀分布进行变形
    for region in regions:
        a = int(1+sqrt(region[0]-1))
        b = int(1+sqrt(region[1]-1))
        if a == b:
            s.append(str(a))
        else:
            s.append(str(a)+':'+str(b))
    result = ','.join(s)
    return result


def pre_order(ports_string):
    '''把输入的端口范围拆成离散的单个端口，以list输出'''
    if not ports_string: return None
    parts = ports_string.split(',')
    selected = set()
    for part in parts:
        sub_parts = part.split(':')
        if len(sub_parts) == 1:
            selected.add(int(sub_parts[0]))
        elif len(sub_parts) == 2:
            min = int(sub_parts[0])
            max = int(sub_parts[1])
            if min == max:
                selected.add(int(min))
            elif max > min:
                for x in range(min, max+1):
                    selected.add(x)
            else:
                raise('format error' + ports_string)
        else:
            raise('format error' + ports_string)
    selected = list(selected)
    selected.sort()
    return selected

def ports_aggragate(ports):
    ''' 将list中的port进行序列化输出，连续的端口会放在一起
    '''
    if not ports: return ''
    if len(ports) == 1: return str(ports[0])
    result = []
    begin = ports[0]
    end = ports[0]
    for port in ports[1:]:
        if port - 1 > end:
            if begin == end:
                result.append(str(begin))
            else:
                result.append(str(begin)+':'+str(end))
            begin = port
            end = port
        else:
            end = port
    else:
        if begin == end:
            result.append(str(begin))
        else:
            result.append(str(begin)+':'+str(end))
    result = ','.join(result)
    return result


if __name__ == '__main__':
    
    ports = pre_order('1,3,5,7,5:9')
    ports_string = ports_aggragate(ports)
    pass
    ports = gen()
    print(ports)
    ports = pre_order(ports)
    ports_string = ports_aggragate(ports)
    print(ports_string)
    pass