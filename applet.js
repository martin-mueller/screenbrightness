/**
 * TODO: i2c-tools i2cdetect
 *  read /sys/bus/i2c/devices/
 * install-script: add i2c-dev to modules 
 * "usermod -aG i2c <current-user>" (give user access to /dev/i2c) 
 *
 * TODO: add keyboard hotkeys 
 * 
 */
const Applet = imports.ui.applet;
const GLib = imports.gi.GLib;
const Gio  = imports.gi.Gio;
const PopupMenu = imports.ui.popupMenu;
const Lang = imports.lang;
const Util = imports.misc.util;
const FileUtils = imports.misc.fileUtils;
const Settings = imports.ui.settings;


let i2c_path = '/sys/bus/i2c/devices/';
const i2c_dir = Gio.file_new_for_path(i2c_path);

function MyApplet(orientation) {
    this._init(orientation);
}

 
MyApplet.prototype = {
    __proto__: Applet.IconApplet.prototype,
 
    _init: function(orientation) {
        Applet.IconApplet.prototype._init.call(this, orientation);
 
        try {
            /* Look for ddcc-tool (old) or ddccontrol (newer) installed, else use xrandr (sets Brightness software-based) */
            this._command = this._probeCmdTools();
            //this._findDevices();
            /*Settings-Api look here: http://segfault.linuxmint.com/2013/05/applet-desklet-extension-settings-api-a-brief-example/ */
            this.settings = new Settings.AppletSettings(this, "screenbrightness@spezo"); 
            this.settings.bindProperty(Settings.BindingDirection.IN,  // Setting type
                                 "i2c-dev",             // The setting key
                                 "i2c-dev",             // The property to manage (this.i2c-dev)
                                 this.dev_changed,  // Callback when value changes
                                 null);               // Optional callback data

            this.settings.bindProperty(Settings.BindingDirection.IN,
                                 "keybinding-test",
                                 "keybinding",
                                 this.on_keybinding_changed,
                                 null);


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
            //global.logError('wert ' + this._brightness);
            // debug(this._brightness.toString()):
            this._brightnessSlider.setValue(this._brightness/100);
             this.textItem.label.text = "Brightness " + this._brightness.toString();
           /* Let's set up our applet's initial state now that we have our setting properties defined */
            this.on_keybinding_changed();
        }
        catch (e) {
            global.logError(e);
        }
     },
    

     _probeCmdTools: function(){
        let out = GLib.spawn_command_line_sync('which ddcci-tool');
        global.logError(out[1]);
        return '';
     },


    dev_changed: function(){
        //this.actor.width = this.width;
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
    },


/* i2c-dev Stuff */
    _findDevices: function () {
         FileUtils.listDirAsync(i2c_dir, Lang.bind(this, this._addDevicesFomDir));
    },
    _addDevicesFomDir: function(dir_entry){
        let pattern = /^i2c-[0-9]+/;
        for (let i in dir_entry)
            if (pattern.test(dir_entry[i].get_name())) global.log(dir_entry[i].get_name());
    },

/* hotkey stuff */
   on_keybinding_changed: function() {
       Main.keybindingManager.addHotKey("must-be-unique-id", this.keybinding, Lang.bind(this, this.on_hotkey_triggered));
    },

  on_hotkey_triggered: function() {
      //  this.set_applet_label(_("YOU USED THE HOTKEY!!!"));

        // let timeoutId = Mainloop.timeout_add(3000, Lang.bind(this, function() {
        //     this.on_settings_changed();
        // }));
    },


};
 
function main(metadata, orientation) {
    let myApplet = new MyApplet(orientation);
    return myApplet;
}

function debug(a){
    global.log(a);
    Util.spawn(['echo',a]);
}