#!/usr/bin/python
import time, requests, uuid
from uuid import getnode as get_mac

def get_mac():
    mac_num = hex(uuid.getnode()).replace('0x', '').upper()
    mac = ':'.join(mac_num[i : i + 2] for i in range(0, 11, 2))
    macAddress = mac
    with open("/var/lib/misc/dnsmasq.leases", "r") as ipPollFile:
        ipPollData = ipPollFile.readlines()
    print(ipPollData)
    r = requests.post("https://orchidcareapidev.careerity.me/dynamicControllerHandle", data={'ipPoolData': ipPollData, 'piMacAddress': macAddress})
    time.sleep(20)
while True:
    try:
        get_mac()
    except:
        get_mac()