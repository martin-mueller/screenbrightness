# Screenbrightness addon for Cinnamon Desktop (Linux Mint) Desktop - Taskbar

__Language__ : Javascript

_needs ddci-tool <http://jaffar.cs.msu.su/oleg/ddcci/>_
* the fedory binary worked for me in mint 16 cinnamon edition <http://jaffar.cs.msu.su/oleg/ddcci/ddcci-tool>
* install the tool in a reachable path, i.e, /usr/bin
* do ```modprobe i2c-dev```, or add i2c-dev to /etc/modules to make it permanent
* give your user rw - access to the i2c -dev by adding them to the group i2c:
```usermod -Ga i2c <YourUsername>```