import telnetlib
import time

class TelnetClient(object):
    def __init__(self, hostname, username, password, port=21):
        self.hostname = hostname
        self.port = port
        self.username = username
        self.password = password
        self.tl = None

    def connect(self, expected=b"login: "):
        try:
            self.tl = telnetlib.Telnet(self.hostname, self.port, timeout=20)
        except Exception as e:
            print("Open telnet exception: %s: %s" % (e.__class__, e))
            self.tl = None
            return -1
        if expected is None:
            return 1
        try:
            r = self.tl.read_until(expected, timeout=10)
        except Exception as e:
            print("Exception: %s: %s" % (e.__class__, e))
            self.close()
            self.tl = None
            return -1
        print(r.decode("ascii"))
        return 1

    def close(self):
        self.tl.close()

    def exec(self, command, expected=None, error_message="这是全宇宙不可能出现的字符串"):
        self.tl.write(command)
        if expected is None:
            time.sleep(1)
            # print(self.tl.read_all().decode('ascii'))
            return 1
        else:
            try:
                r = self.tl.read_until(expected, timeout=10)
                buff = r.decode("ascii")
                print(buff)
                if error_message in buff:
                    return -1
            except Exception as e:
                print("Exception: %s: %s" % (e.__class__, e))
                return -1

            return 1

    def exec_batch(self, command_list):
        """
        执行一个序列的多个命令
        """
        for command in command_list:
            print(command)
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
    client = TelnetClient('192.168.100.133', 'root', 'ALu12#')
    r = client.connect()
    if r < 0:
        print("error??")
        exit(-1)
    client.exec_batch([
        (b"root\n", b"Password: "),
        (b"ALu12#\n", b"#"),
        (b"ls\n", b"#")
    ])
    client.close()

    