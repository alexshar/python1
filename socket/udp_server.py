'''This is a typical UDP server side'''
# -*- coding: utf-8 -*-

import socket
port = 8081
s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
s.bind(('', port))
print('waiting for input')
while True:
    data,addr = s.recvfrom(1024)
    print('Received:', data, ' from', addr, end='\n')

