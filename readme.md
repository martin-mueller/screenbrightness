# Screenbrightness addon for Cinnamon Desktop (Linux Mint) Desktop - Taskbar
## Quick Description
I wrote this to control the brightness of an external lcd - monitor from my notebook.
It is just a wrapper to control __ddcci-tool__ from the taskbar.
Basically, it does:

````ddcci-tool -r 0x10 -w brightness_in_% /dev/i2c-1````

OR 
````xrandr --output VGA1 --brightness [0-1]````

You should change "/dev/i2c-1" to your device.

__Language__ : Javascript

__Version__: still alpha

_needs ddci-tool <http://jaffar.cs.msu.su/oleg/ddcci/>_
* the fedory binary worked for me in mint 16 cinnamon edition <http://jaffar.cs.msu.su/oleg/ddcci/ddcci-tool>
* install the tool in a reachable path, i.e, /usr/bin
* do ````modprobe i2c-dev````
or add i2c-dev to /etc/modules to make it permanent
* give your user rw - access to the i2c -dev by adding them to the group i2c:
	````usermod -Ga i2c YourUsername````



### installing ddccontrol
* make: add flag -lm
 <http://stackoverflow.com/questions/1033898/why-do-you-have-to-link-the-math-library-in-c> 
set LD_LIBRARY_PATH : ```` export LD_LIBRARY_PATH="/usr/local/lib````


## DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!DEVELOPERS !!!
plz. take a look athe issues
<https://github.com/martin-mueller/screenbrightness/issues?labels=question&state=open>

### Monitor detection 

### Useful local files
~/.config/monitors.xml

### links
* <https://github.com/lordamit/Brightness/> : Gnome Brightness Controller (Python), requires Package python-pyside, 
  <https://dl.dropboxusercontent.com/u/84627545/brightness_1.0.1_all.deb>