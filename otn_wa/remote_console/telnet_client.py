import time
import re
import logging
import telnetlib

class TelnetClient(object):
    def __init__(self, hostname, username, password, port=21):
        self.hostname = hostname
        self.port = port
        self.username = username
        self.password = password
        self.tl = None

    def connect_otn(self, expected=b"login: "):
        '''
        这是为NSP特别定制的连接过程...!
        '''
        # 建立telnet基础连接
        try:
            self.tl = telnetlib.Telnet(self.hostname, timeout=10)
        except Exception as e:
            logging.warning("Open telnet exception: %s: %s" % (e.__class__, e))
            self.tl = None
            return -1
        if expected is None:
            return 1
        
        # 登录过程
        try:
            r = self.tl.read_until(b"login: ", timeout=10)
            logging.info(r.decode("ascii"))
            self.tl.write(b'cli\n')

            r = self.tl.read_until(b"Username: ", timeout=10)
            logging.info(r.decode("ascii"))
            self.tl.write(b'admin\n')

            r = self.tl.read_until(b"Password: ", timeout=10)
            logging.info(r.decode("ascii"))
            self.tl.write(b'admin\n')

            r = self.tl.read_until(b"(Y/N)?", timeout=10)
            logging.info(r.decode("ascii"))
            self.tl.write(b'Y\n')
            r = self.tl.read_until(b"# ", timeout=10)
            logging.info(r.decode("ascii"))
        except Exception as e:
            logging.warning("Exception: %s: %s" % (e.__class__, e))
            self.close()
            self.tl = None
            return -1
        logging.info(r.decode("ascii"))
        return 1

    def connect(self, expected=b"login: "):
        try:
            self.tl = telnetlib.Telnet(self.hostname, timeout=10)
        except Exception as e:
            logging.warning("Open telnet exception: %s: %s" % (e.__class__, e))
            self.tl = None
            return -1
        if expected is None:
            return 1
        try:
            r = self.tl.read_until(expected, timeout=10)
        except Exception as e:
            logging.warning("Exception: %s: %s" % (e.__class__, e))
            self.close()
            self.tl = None
            return -1
        logging.info(r.decode("ascii"))
        return 1

    def close(self):
        self.tl.close()
        logging.info('Telnet closed')

    def exec(self, command, expected=None, error_message="这是全宇宙不可能出现的字符串"):
        re_delay = "#DELAY@(\d+)s"
        check_str = str(command, encoding='ascii')
        r = re.search(re_delay, check_str, flags=re.I)
        # 执行内部命令
        if r is not None:
            delay = int(r.group(1))
            time.sleep(delay)
            return 1
        # 执行控制台命令
        self.tl.write(command)
        if expected is None:
            time.sleep(2)
            logging.info(self.tl.read_all().decode('ascii'))
            return 1
        else:
            try:
                r = self.tl.read_until(expected, timeout=10)
                buff = r.decode("ascii")
                logging.info(buff)
                if error_message in buff:
                    return -1
            except Exception as e:
                logging.warning("Exception: %s: %s" % (e.__class__, e))
                return -1

            return 1

    def exec_batch(self, command_list):
        """
        执行一个序列的多个命令
        """
        for command in command_list:
            logging.info(command)
            if len(command) == 2:
                r = self.exec(command[0], command[1])
            elif len(command) > 2:
                r = self.exec(command[0], command[1], error_message=command[2])
            elif len(command) == 1:
                r = self.exec(command[0])
            else:
                r = -2
            if r < 0:
                return r
        return 1

if __name__ == "__main__":
    logging_format = "[%(asctime)s] %(filename)s[:%(lineno)d] %(message)s"
    logging.basicConfig(level=logging.DEBUG, format=logging_format)    
    client = TelnetClient('135.251.97.201', 'root', 'ALu12#')
    r = client.connect_otn()
    if r < 0:
        print("error??")
        exit(-1)
    client.exec_batch([
        (b"help\n", b"# ")
    ])
    client.close()

    