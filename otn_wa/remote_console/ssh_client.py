import paramiko

class SSHClient(object):
    def __init__(self, hostname, port, username, password):
        self.hostname = hostname
        self.port = port
        self.username = username
        self.password = password
        try:
            self.client = paramiko.SSHClient()
        except Exception as e:
            print("Exception: %s: %s" % (e.__class__, e))


    def close(self):
        self.client.close()

    def connect(self):
        return self.client.connet(self.hostname, self.port, self.username, self.password)

    def exec(self, command):
        pass




