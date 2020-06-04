import re, time
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
            print("Create SSH client exception: %s: %s" % (e.__class__, e))
            self.client = None
    
    def connect(self, expected='# '):
        """
        连接开始.
        这里的expected是登录成功之后的提示符. 
        强烈建议不要用默认值, 而是根据登录的系统的实际情况, 输入实当的参数.
        """
        try:
            print(f"Connecting... host={self.hostname} username={self.username} password={self.password}")
            self.client.connect(self.hostname, username=self.username, password=self.password)
            self.chan = self.client.invoke_shell()
        except Exception as e:
            print("SSH connection exception: %s: %s" % (e.__class__, e))
            self.close()
            self.client = None
            return -1
        
        buff = ''
        while not buff.endswith(expected):
            resp = self.chan.recv(9999)
            buff += resp.decode()
        print(buff)
        return 1

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
            return 1
        # 下发命令
        self.chan.send(command)
        buff = ''
        i = 0
        while not buff.endswith(expected):
            resp = self.chan.recv(9999)
            buff += resp.decode()
            i = i + 1
            if error_message in buff:
                print(buff)
                return -1
            if i > 5:
                print(buff)
                return -2
           
        print(buff)
        return 1

if __name__ == "__main__":
    client = SSHClient("172.24.166.141", 'root', 'ALu12#')
    if client is None: exit()
    client.connect()
    # 小心空格千万不能省略
    r = client.exec_batch([
        ('vsim cli\n', 'Username: '),
        ('admin\n', 'Password: '),
        ('admin\n', '(Y/N)?'),
        ('Y\n', "# ")
    ])
    client.close()


