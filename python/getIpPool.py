#!/usr/bin/python
import time, requests, uuid
from uuid import getnode as get_mac

def get_mac():
    mac_num = hex(uuid.getnode()).replace('0x', '').upper()
    mac = ':'.join(mac_num[i : i + 2] for i in range(0, 11, 2))
    return mac
while True:
    try:
        macaddress = get_mac()
        with open("/var/lib/misc/dnsmasq.leases", "r") as ipPollFile:
            ipPollData = ipPollFile.readlines()
        print(ipPollData)
        r = requests.post("https://orchidcareapidev.careerity.me/dynamicControllerHandle", data={'ipPoolData': ipPollData, 'piMacAddress': macAddress}, timeout=20)
    except requests.exceptions.ConnectionError:
        print("Connection error occur retry...")
        r.connection.close()
        time.sleep(30)
        get_mac()
    time.sleep(20)