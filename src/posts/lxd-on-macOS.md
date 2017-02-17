---
title: LXD on macOS 
publishedDate: 2017-02-17T21:29
tags: lxd,containers
---

I use [LXD](https://linuxcontainers.org/lxd/introduction/) on macOS, it might be
helpful to someone if I share my setup, which I keep documented and up to date
in a [Gist](https://gist.github.com/earnubs/eec3c6aa1e091c0a898c) but I may as
well add it here too.

Originally based on: http://mike.teczno.com/notes/disposable-virtualbox-lxc-environments.html

# VM Setup

Download an Ubuntu Server ISO (http://www.ubuntu.com/download/server)

Create a new VMWare virtual machine, select boot from the ISO with 2 NICs configured as "Share with My Mac" & "Private to my Mac" respectively. During the creation of the Ubuntu VM there will be a page to select installed software, select "OpenSSH server".

# VM Networking

Log in to the newly created VM and install bridge-utils:

```
apt install bridge-utils
```

Edit /etc/network/interfaces with a bridge each for the 2 network cards, both DHCP (`ip link show` will give you the correct names for these interfaces).

```
## The primary network interface
#auto ens33
#iface ens33 inet dhcp

auto br0
iface br0 inet dhcp
        bridge_ports ens33
        bridge_fd 0
        bridge_maxwait 0
        dns-search home

auto br1
iface br1 inet dhcp
        bridge_ports ens38
        bridge_fd 0
        bridge_maxwait 0
        dns-search local

```


Restart `sudo reboot`, and you should now be able to ping the outside world.

```
$ ping 8.8.8.8

PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_req=1 ttl=63 time=340 ms
…
```

Install open-vm-tools:

```
$ apt install open-vm-tools
```

# Avahi on VM

Next, set up Avahi to broadcast host names so we don’t need to remember DHCP-assigned IP addresses. On the Ubuntu host, install avahi-daemon:

```
$ apt install avahi-daemon
```

In the configuration file `/etc/avahi/avahi-daemon.conf`, change these lines to clarify that our host names need only work on the second, host-only network adapter:

```
allow-interfaces=br1,ens38
deny-interfaces=br0,ens33,lxdbr0
```

Then restart Avahi:

```
$ sudo service avahi-daemon restart
```
Now, you should be able to ping and ssh to $hostname from within the virtual machine and your Mac command line.

# LXD server (Ubuntu VM)

```
sudo add-apt-repository ppa:ubuntu-lxc/lxd-stable
sudo apt update
sudo apt upgrade
```

See: https://linuxcontainers.org/lxd/getting-started-cli/

```
$ sudo apt install zfsutils-linux
$ sudo lxd init
```

Generate a new LXD profile from the script here: https://gist.github.com/earnubs/7dffc5bb5fe613d02ef9fc924cc583ee

Test out lxc launch:

```
$ lxc launch ubuntu:16.10 --ephemeral -p $USER
$ lxc list
+--------------+---------+--------------------------------+------+-----------+-----------+
|     NAME     |  STATE  |              IPV4              | IPV6 |   TYPE    | SNAPSHOTS |
+--------------+---------+--------------------------------+------+-----------+-----------+
| enabling-ape | RUNNING | 192.168.234.179 (eth0)         |      | EPHEMERAL | 0         |
|              |         | 172.16.183.150 (eth1)          |      |           |           |
+--------------+---------+--------------------------------+------+-----------+-----------+
```

NB. It may take a few minutes for cloud-init to configure and restart eth1.

Allow remote operations on the LXD server (from macOS)
```
lxc config set core.https_address "[::]"
lxc config set core.trust_password some-password
```

# LXD client (macOS)

With a working Go setup:

```
$ go get github.com/lxc/lxd
$ cd $GOPATH/src/github.com/lxc/lxd
$ go install -v ./lxc
```

```
$ lxc remote add <name> UBUNTU_VM_HOST.local
```

# Finally, on macOS

```
$ ssh enabling-ape.local -A
```

