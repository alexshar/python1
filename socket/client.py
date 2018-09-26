import socket
import time
import threading

PORT = 5687
remoteAddress = ('52.80.90.70', PORT)
#remoteAddress = ('127.0.0.1', PORT)
myAddress = ('', PORT)
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind(myAddress)

msgLen = 40
repeat = 20
isRecv = True
msg = b'testing'
for x in range(msgLen):
    pass #msg.append(40)

def recvThread():
    recvNumber = 0
    while isRecv:
        data, address = s.recvfrom(1024)
        if not data:
            break
        recvNumber = recvNumber + 1
        print('recv', data, 'from', address, '#', recvNumber)
    print('Total packets received:', recvNumber)

def sendThread():
    for x in range(repeat):
        s.sendto(msg, remoteAddress)
        time.sleep(0.1)
        print('send', msg, '#', x + 1)
    s.sendto(b'', remoteAddress)

if __name__ == '__main__':
    # init socket

    # start receiving
    t = threading.Thread(target=recvThread, name='LoopThread')
    t.start()
    # start sending
    sendThread()
    # ending
    time.sleep(2)
    isRecv = False
    t.join()
    s.close()
