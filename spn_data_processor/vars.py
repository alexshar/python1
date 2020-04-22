OBJ_TYPES = {
    "ne": 0,
    "phyconn": 1,
    "card": 2,
    "port": 3,
    "eline": 4,
    "etree": 5,
    "elan": 6,
    "l3vpn": 7,
    "flexe": 8,
    "pw": 9,
    "tunnel": 10,
    "nms": 101
}

PM_TYPES = {
    "flow": 1,
    "inflow": 2,
    "outflow": 3,
    "flowrate": 4,
    "inrate": 5,
    "outrate": 6,
    "throughput": 7,
    "loss": 8, # drop pkts
    "lossRate": 9,
    "biterror": 10,
    "latency": 11,
    "jitter": 12,
    "input_power": 13,
    "output_power": 14,
    "outpkt": 15,
    "mrs": 1001, # master rs number
    "srs": 1002, # slave rs number
    "flowcastEnable": 1003, # flowcast enable
}

INTERVAL_TYPES = {
    "min": 0,
    "quar": 1,
    "hour": 2,
    "day": 3,
    "week": 4,
    "month": 5
}