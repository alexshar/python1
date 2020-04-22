### objectType
ne(0, "ne"), phyconn(1, "phyconn"), card(2, "card"), port(3, "port"), eline(4, "eline"), etree(5, "etree"),
elan(6, "elan"), l3vpn(7, "l3vpn"), flexe(8, "flexe"), pw(9, "pw"), tunnel(10, "tunnel"), nms(101, "nms");

### pmType
    flow(1, "flow"), inflow(2, "inflow"), outflow(3, "outflow"), flowrate(4, "flowrate"), inrate(5, "in flow rate"),
    outrate(6, "out flow rate"), throughput(7, "throughput"), loss(8, "drop pkts"), lossRate(9, "drop pkts rate"),
    biterror(10, "biterror"), latency(11, "latency"), jitter(12, "jitter"), input_power(13, "input power"),
    out_power(14, "out power"), outpkt(15, "out pkts"), mrs(1001, "master rs number"), srs(1002, "slave rs number"),
    flowcastEnable(1003, "flowcast enable");

### intervalType:
public enum PmIntervalType {
    INTERVAL_1MIN(0, "1 minute"), // 1分钟
    INTERVAL_15MIN(1, "15 minute"), // 15分钟
    INTERVAL_1H(2, "1 hour"), // 1小时
    INTERVAL_1DAY(3, "1 day"), // 天
    INTERVAL_1WEEK(4, "1 week"), // 周
    INTERVAL_1MONTH(5, "1 month") // 月
}