"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = require("path");
const url = require("url");
const Splashscreen = require("@trodi/electron-splashscreen");
let win;
let lines = ['Never gonna give you up',
    'Never gonna let you down',
    'Never gonna run around and desert you',
    'Never gonna make you cry',
    'Never gonna say goodbye',
    'Never gonna tell a lie and hurt you'];
electron_1.app.on("ready", () => {
    showSplash();
});
//app.on('activate', () => {
//  if (win === null) {
//    showSplash();
//    createWindow();
//  }
//})
function showSplash() {
    const windowOptions = { width: 1138, height: 712, frame: false, icon: __dirname + '/../../src/assets/images/dp5-256.ico' };
    const ret = Splashscreen.initDynamicSplashScreen({
        windowOpts: windowOptions,
        templateUrl: path.join(__dirname, "/../dynamic-splashscreen.html"),
        delay: 0,
        splashScreenOpts: {
            height: 700,
            width: 600,
            transparent: true,
            webPreferences: {
                nodeIntegration: true,
            },
        },
    });
    win = ret.main;
    /** Send information to the splashscreen. */
    const update = (i) => {
        ret.splashScreen.webContents.send("update", lines[i]);
        if (i < lines.length) {
            setTimeout(() => update(i + 1), 100);
        }
        else {
            // Done sending updates to mock progress while loading window, so
            // go ahead and load the main window.
            createWindow();
        }
    };
    update(0);
}
function createWindow() {
    //win = new BrowserWindow({ width: 1138, height: 712, frame: false, icon: __dirname + '/../../src/assets/images/dp5-256.ico'});
    win.setMenu(null);
    addBeforeSendHeadersCallBack();
    //load the dist folder from Angular
    win.loadURL(url.format({
        pathname: path.join(__dirname, `/../../dist/index.html`),
        protocol: "file:",
        slashes: true
    }));
    // The following is optional and will open the DevTools:
    win.webContents.openDevTools();
    win.on("closed", () => {
        win = null;
    });
}
function addBeforeSendHeadersCallBack() {
    // Add Origin headers in all requests
    electron_1.session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
        details.requestHeaders['Origin'] = 'electron://dp5.ziath.com';
        callback({ cancel: false, requestHeaders: details.requestHeaders });
    });
}
// on macOS, closing the window doesn't quit the app
electron_1.app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        electron_1.app.quit();
    }
});
//app.commandLine.appendSwitch('disable-gpu-compositing');
if (process.platform === 'linux') {
    electron_1.app.disableHardwareAcceleration();
}
//# sourceMappingURL=main.js.map