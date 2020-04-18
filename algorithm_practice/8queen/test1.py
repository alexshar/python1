def check(arr, dp):
	for x in range(0, dp, 1):
		if (p[x] == p[dp]) or (p[x]+(dp-x)==p[dp]) or (p[x]-(dp-x)==p[dp]):
			return -1
	return 1

def stepnext(arr, dp):
	if arr[dp] == 8 and (dp == 1) and (arr[0]==8):
		return -1
	for x in range (dp+1, 8, 1):
		p[x] = 1
	p[dp] = p[dp] + 1
	for x in range (dp, -1, -1):
		if p[x] == 9:
			p[x] = 1
			p[x-1] = p[x-1] + 1
		else:
			return x

def xprint(arr):
	for x in range(0, 8, 1):
		k = [0, 0, 0, 0, 0, 0, 0, 0]
		k[arr[x]-1] = 1
		print (k)
	print ("\n")

print ("start!!!!")
# the main starts from here
p = [1, 1, 1, 1, 1, 1, 1, 1]
solution = 0
deep = 0
	
#main loop
while True:
	#print (p)
	if 1 == check(p, deep): #can put it!
		if deep == 7:
			#print ("good! we found a solution")
			xprint (p)
			solution = solution + 1
			deep = stepnext(p, deep)
			if deep == -1:
				break
		else:
			deep = deep + 1
	else:
		deep = stepnext(p, deep)
		if deep == -1:
			break

print("solution = ", solution)
