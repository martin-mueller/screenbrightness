# Screenbrightness addon for Cinnamon Desktop (Linux Mint) Desktop - Taskbar
## Quick Description
I wrote this to control the brightness of an external lcd - monitor from my notebook.
It is just a wrapper to control __ddcci-tool__ from the taskbar.
Basically, it does:
````ddcci-tool -r 0x10 -w brightness_in_% /dev/i2c-1````

You should change "/dev/i2c-1" to your device.

__Language__ : Javascript

__Version__: still alpha

_needs ddci-tool <http://jaffar.cs.msu.su/oleg/ddcci/>_
* the fedory binary worked for me in mint 16 cinnamon edition <http://jaffar.cs.msu.su/oleg/ddcci/ddcci-tool>
* install the tool in a reachable path, i.e, /usr/bin
* do ````modprobe i2c-dev````
or add i2c-dev to /etc/modules to make it permanent
* give your user rw - access to the i2c -dev by adding them to the group i2c:
	usermod -Ga i2c <YourUsername>