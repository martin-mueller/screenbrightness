/*TODO: i2c-tools i2cdetect*/
/* install-script: add i2c-dev to modules */
/* "usermod -aG i2c <current-user>" (give user access to /dev/i2c) */
const Applet = imports.ui.applet;
const GLib = imports.gi.GLib;
const PopupMenu = imports.ui.popupMenu;
const Lang = imports.lang;
const Util = imports.misc.util;

function MyApplet(orientation) {
    this._init(orientation);
}

 
MyApplet.prototype = {
    __proto__: Applet.IconApplet.prototype,
 
    _init: function(orientation) {
        Applet.IconApplet.prototype._init.call(this, orientation);
 
        try {
             
            this.set_applet_icon_name("display-brightness-symbolic");
            this.set_applet_tooltip("Brightness");

            this.menuManager = new PopupMenu.PopupMenuManager(this);
            this.menu = new Applet.AppletPopupMenu(this, orientation);
            this.menuManager.addMenu(this.menu);  

            this.textItem = new PopupMenu.PopupMenuItem("Brightness");
            this.textItem.connect('activate', Lang.bind(this, function () {
                // Code to execute when clicked here
                // .........
            }));
            this.menu.addMenuItem(this.textItem);


            // this._switch = new PopupMenu.PopupSwitchMenuItem("ON/OFF", this._switchState);
            // this.menu.addMenuItem(this._switch);

            this._brightnessSlider = new PopupMenu.PopupSliderMenuItem(100);
            this._brightnessSlider.connect('value-changed', Lang.bind(this, this._sliderChanged));
            this.menu.addMenuItem(this._brightnessSlider);
            //this._cmd = 'ddcci-tool -r 0x10 /dev/i2c-1 | awk \'$2 == "0x10:" { print $3 }\' | awk -F \'/\' \'{ print $2 }\'';
            this._cmd = 'ddcci-tool -r 0x10 /dev/i2c-1';
            let ret = GLib.spawn_command_line_sync(this._cmd);
            this._brightness = this._findBrightnessFromOutput(ret[1].toString());
            // global.logError('wert ' + this._brightness);
            // debug(this._brightness.toString()):
            this._brightnessSlider.setValue(this._brightness/100);
        }
        catch (e) {
            global.logError(e);
        }
     },
 
    on_applet_clicked: function(event) {
      this.menu.toggle();      
    },
    _sliderChanged: function(slider, value) {
        this._setBrightness(Math.floor(value * 100));
    },
    _setBrightness: function(value) {
         
        this.textItem.label.text = "Brightness " +value;
         GLib.spawn_command_line_async('ddcci-tool -r 0x10 -w '+ value + ' /dev/i2c-1');
    },
    _findBrightnessFromOutput: function(str){
         let lines = str.split("\n");
         for(let i = 0; i < lines.length; i++) {
            if (lines[i].indexOf("Control 0x10") > -1){
                let vals = lines[i].split('/');
                let b = parseInt(vals[1]);
                return b;
            }
         }
    }

};
 
function main(metadata, orientation) {
    let myApplet = new MyApplet(orientation);
    return myApplet;
}

function debug(a){
    global.log(a);
    Util.spawn(['echo',a]);
}