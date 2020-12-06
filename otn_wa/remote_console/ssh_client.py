import re, time
import logging
import paramiko

class SSHClient(object):
    def __init__(self, hostname, username, password, port=22):
        self.hostname = hostname
        self.port = port
        self.username = username
        self.password = password
        self.client = None
        try:
            self.client = paramiko.SSHClient()
            self.client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        except Exception as e:
            logging.warning("Create SSH client exception: %s: %s" % (e.__class__, e))
            self.client = None
    
    def connect_otn(self, expected='# '):
        """
        OTN
        """
        try:
            logging.info(f"Connecting... host={self.hostname} username={self.username} password={self.password}")
            self.client.connect(self.hostname, username=self.username, password=self.password)
            self.chan = self.client.invoke_shell()
        except Exception as e:
            logging.warning("SSH connection exception: %s: %s" % (e.__class__, e))
            self.close()
            self.client = None
            return -1
        
        buff = ''
        while not buff.endswith(expected):
            resp = self.chan.recv(9999)
            buff += resp.decode()
        logging.info(buff)
        r = self.exec_batch([
            ('vsim cli\n', 'Username: '),
            ('admin\n', 'Password: '),
            ('admin\n', '(Y/N)?'),
            ('Y\n', "# ")
        ])
        return 1

    def connect(self, expected='# '):
        """
        连接开始.
        这里的expected是登录成功之后的提示符. 
        强烈建议不要用默认值, 而是根据登录的系统的实际情况, 输入实当的参数.
        """
        try:
            logging.info(f"Connecting... host={self.hostname} username={self.username} password={self.password}")
            self.client.connect(self.hostname, username=self.username, password=self.password)
            self.chan = self.client.invoke_shell()
        except Exception as e:
            logging.warning("SSH connection exception: %s: %s" % (e.__class__, e))
            self.close()
            self.client = None
            return -1

        buff = ''
        while not buff.endswith(expected):
            resp = self.chan.recv(9999)
            buff += resp.decode()
        logging.info(buff)
        return 1

    def close(self):
        self.client.close()
        logging.info("SSH closed")

    def exec_batch(self, command_list):
        """
        执行一个序列的多个命令
        """
        for command in command_list:
            if len(command) == 2:
                r, msg = self.exec(command[0], command[1])
            elif len(command) == 3:
                r, msg = self.exec(command[0], command[1], error_message=command[2])
            else:
                r = -2
                msg = "command error"
            if r < 0:
                return r
        return 1

    def exec(self, command, expected, error_message="这是全宇宙不可能出现的字符串"):
        """
        执行一个命令
        command是输入的命令, 请注意回车也是命令的一部分, 需要适当加入'\n', 否则没有效果.
        """
        re_delay = "#DELAY@(\d+)s"
        r = re.search(re_delay, command, flags=re.I)
        # 执行内部命令
        if r is not None:
            delay = int(r.group(1))
            time.sleep(delay)
            return 1, ""
        # 下发命令
        self.chan.send(command)
        buff = ''
        i = 0
        while not buff.endswith(expected):
            resp = self.chan.recv(9999)
            buff += resp.decode()
            i = i + 1
            if error_message in buff:
                logging.info(buff)
                return -1, buff
            if i > 20:
                logging.info(buff)
                return -2, buff
           
        logging.info(buff)
        return 1, buff

if __name__ == "__main__":
    logging_format = "[%(asctime)s] %(filename)s[:%(lineno)d] %(message)s"
    logging.basicConfig(level=logging.DEBUG, format=logging_format)    
    client = SSHClient("172.24.166.141", 'root', 'ALu12#')
    if client is None: exit()
    if client.connect_otn() < 0: exit()
    # 小心空格千万不能省略
    r = client.exec_batch([
        ('help\n', "# ")
    ])
    client.close()


