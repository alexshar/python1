'''
质数
'''
import math

def get_numbers(max=1000):
    if max < 2:
        return []
    result = [2]
    for n in [x*2+1 for x in range(1,int(max/2))]:
        for m in result:
            if m > math.sqrt(n):
                result.append(n)
                break;
            if n/m == int(n/m):
                break;
    return result

l = get_numbers(100)
print(l)
print(49369*34877)
print(49369-34877)
