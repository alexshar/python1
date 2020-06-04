#! /usr/bin/env python3
import logging

try:
    import ssh_client
except ImportError:
    from . import ssh_client

try:
    import telnet_client
except ImportError:
    from . import telnet_client

class RemoteConsoleClient():
    def __init__(self, hostname, port=None, username=None, password=None):
        self.hostname = hostname
        self.port = port
        self.username = username
        self.password = password
        self.protocal = 1
        self.client = None

    def connect(self, expected='# '):
        logging.info(f"Connecting... host={self.hostname} username={self.username} password={self.password}")
        # test ssh
        logging.debug("Testing SSH...")
        self.client = ssh_client.SSHClient(self.hostname, self.username, self.password, self.port)
        r = self.client.connect(expected)
        if r > 0:
            logging.debug("SSH connected")
            return 1
        # test telent
        logging.debug("Testing Telnet...")
        self.client = telnet_client.TelnetClient(self.hostname, self.username, self.password, self.port)
        r = self.client.connect(expected)
        if r > 0:
            logging.debug("Telnet connected")
            self.protocal = 2
            return 1
        # 都不对
        self.client = None
        self.protocal = 0
        return -1

    def close(self):
        self.client.close()
    
    def exec_batch(self, command_list):
        """
        执行一个序列的多个命令
        """
        for command in command_list:
            if len(command) == 2:
                r = self.exec(command[0], command[1])
            elif len(command) == 3:
                r = self.exec(command[0], command[1], error_message=command[2])
            else:
                r = -2
            if r < 0:
                return r
        return 1

    def exec(self, command, expected, error_message='impossible kakdikKSI39328ss'):
        if self.client is None: return -2
        if self.protocal == 1:
            if error_message is None:
                error_message = 'impossible kakdikKSI39328ss'
            return self.client.exec(command, expected, error_message=error_message)
        elif self.protocal == 2:
            if "vsim cli" in command:
                telnet_command = b'cli\n'
            else:
                telnet_command = bytes(command, encoding='ascii')
            if expected is not None:
                telnet_expected = bytes(expected, encoding='ascii')
            else:
                telnet_expected = None
            if error_message is not None:
                telnet_error_message = bytes(error_message, encoding='ascii')
            else:
                telnet_error_message = b'impossible kakdikKSI39328ss'
            return self.client.exec(telnet_command, telnet_expected, error_message=telnet_error_message)
        else:
            return -2

if __name__ == "__main__":
    logging_format = "[%(asctime)s] %(filename)s[:%(lineno)d] %(message)s"
    logging.basicConfig(level=logging.DEBUG, format=logging_format)
    instance = RemoteConsoleClient('172.24.166.140', username='root', password='ALu12#')
    instance.connect()
    instance.exec("ls\n", "]# ", None)
