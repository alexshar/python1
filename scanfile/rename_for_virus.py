import os
import shutil
import time

emailMap = {
    
}

source_dir = "e:\\temp\\clips\\1.1.2\\"
dest_dir = "e:\\temp\\clips\\"
# counter = 0
# plus = 30
# for item in os.listdir(r'd:\source'):
# for item in os.listdir(source_dir):
# 	number = int(item[5:7]) + plus
# 	if number < 10:
# 		new_name = "0" + str(number) + ".mp3"
# 	else:
# 		new_name = str(number) + ".mp3"
# 	#new_name = "41" + new_name
# 	counter = counter + 1
# 	#os.rename(source_dir+item, source_dir+new_name)
# 	shutil.copyfile(source_dir + item, dest_dir + new_name)
# 	print(source_dir + item, dest_dir + new_name)
# 	time.sleep(1.5)
	
# print ("the total number is " + str(counter))

def getParts(name):
    x = name.rfind(".")
    if x < 0:
        return ""
    ext = name[x:].lower()
    pre = name[:x].lower()
    print(pre)
    return pre

for item in os.listdir(source_dir):

    continue


fileName = "chEnchen.xie.ext@nokia-sbell.com.jpg"
getParts(fileName)
pass
