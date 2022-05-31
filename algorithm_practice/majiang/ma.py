import random

max = 4

def gen() -> list:
    result = []
    while len(result) < 14:
        num = random.randint(1, 9)
        # check
        if result.count(num) == max:
            continue
        result.append(num)
    result.sort()
    print(result)
    return result


def is_win(input:list) -> bool:
    result = False
    # check
    for i in range(13):
        # 清理
        pai = input[:]
        pai.sort()
        # for j in len(pai):
        #     pai[j]['chosen'] = False
        dazi = [[], [], [], []]
        dazi_type = [0, 0, 0, 0]
        # 选将牌
        if pai[i] != pai[i+1]:
            continue
        jiang = [pai.pop(i), pai.pop(i)]
        # 理搭子
        dazi_index = 0
        while dazi_index < 4:
            if dazi_type[dazi_index] == 2:
                # 退！退！退！
                if dazi_index > 0: 
                    dazi_index = dazi_index - 1
                    pai.extend(dazi[dazi_index])
                    pai.sort()
                    dazi[dazi_index] = []
                    dazi_type[dazi_index] = dazi_type[dazi_index] + 1
                    continue
                else:
                    break
            try:
                dazi[dazi_index].append(pai.pop(0))
                dazi[dazi_index].append(pai.pop(pai.index(dazi[dazi_index][0]+dazi_type[dazi_index])))
                dazi[dazi_index].append(pai.pop(pai.index(dazi[dazi_index][1]+dazi_type[dazi_index])))
            # 匹配失败
            except ValueError:
                pai.extend(dazi[dazi_index])
                pai.sort()
                dazi[dazi_index] = []
                dazi_type[dazi_index] = dazi_type[dazi_index] + 1
                continue
            else:
                dazi_index = dazi_index + 1
        else:
            result = True
            break

    # give result
    if result:
        print(jiang, dazi[0], dazi[1], dazi[2], dazi[3])
    return result


if __name__ == '__main__':
    hu = False
    while not hu:
        random_list = gen()
        hu = is_win(random_list)
        print(hu)
    #print(is_win([1, 1, 2, 3, 4, 5, 5, 5, 5, 6, 7, 9, 9, 9]))
