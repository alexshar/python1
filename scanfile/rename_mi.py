import os
import shutil
import time

source_dir = "e:\\temp\\clips\\"
dest_dir = "f:\\"
counter = 0
plus = 0
# for item in os.listdir(r'd:\source'):
for item in os.listdir(source_dir):
	number = int(item[0:2]) + plus
	if number < 10:
		new_name = "0" + str(number) + ".mp3"
	else:
		new_name = str(number) + ".mp3"
	new_name = "41" + new_name
	counter = counter + 1
	#os.rename(source_dir+item, source_dir+new_name)
	shutil.copyfile(source_dir + item, dest_dir + new_name)
	print(source_dir + item, dest_dir + new_name)
	time.sleep(0.3)
	
print ("the total number is " + str(counter))
