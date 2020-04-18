import os

def hanoi (n, x, y, z):
	if n == 1:
		print (x, "=>", z)
	else:
		hanoi (n-1, x, z, y)
		print (x, "=>", z)
		hanoi (n-1, y, x, z)

def getsource(dire):
	srcdir = input()
	print("your input is:", srcdir)

sourcedir = "."
counter = 0
for item in os.listdir(r'd:\source'):
	print(item)
	counter = counter + 1
print ("the total number is")
print (counter)




hanoi (4, "x", "y", "z")