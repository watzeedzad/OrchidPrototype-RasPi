#!/usr/bin/python
import time, requests, uuid
from uuid import getnode as get_mac

def get_mac():
    mac_num = hex(uuid.getnode()).replace('0x', '').upper()
    mac = ':'.join(mac_num[i : i + 2] for i in range(0, 11, 2))
    return mac
try:
    macAddress = get_mac()
    with open("/var/lib/misc/dnsmasq.leases", "r") as ipPollFile:
       ipPollData = ipPollFile.readlines()
    print(ipPollData)
    # r = requests.post("http://192.168.1.151:3001/dynamicControllerHandle", data={'ipPoolData': ipPollData, 'piMacAddress': macAddress}, timeout=20)
except requests.exceptions.ConnectionError:
    print("connection_error")
