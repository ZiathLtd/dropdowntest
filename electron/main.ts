import { session, app, BrowserWindow, Menu } from 'electron'
import * as path from 'path'
import * as url from 'url'
import * as Splashscreen from "@trodi/electron-splashscreen";

let win: BrowserWindow
let lines: string[] = ['Never gonna give you up',
               'Never gonna let you down',
               'Never gonna run around and desert you',
               'Never gonna make you cry',
               'Never gonna say goodbye',
               'Never gonna tell a lie and hurt you'];


app.on("ready", () =>{
  showSplash();
});
//app.on('activate', () => {
//  if (win === null) {
//    showSplash();
//    createWindow();
//  }
//})

function showSplash(){

  const windowOptions = { width: 1138, height: 712, frame: false, icon: __dirname + '/../../src/assets/images/dp5-256.ico'};
  const ret: Splashscreen.DynamicSplashScreen = Splashscreen.initDynamicSplashScreen({
        windowOpts: windowOptions,
        templateUrl: path.join(__dirname, "/../dynamic-splashscreen.html"),
        delay: 0, // force show immediately to better illustrate example
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
  const update = (i: number): void => {
      ret.splashScreen.webContents.send("update", lines[i]);
      if (i < lines.length) {
          setTimeout(() => update(i+1), 100);
      } else {
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
    win.loadURL(
      url.format({
        pathname: path.join(__dirname, `/../../dist/index.html`),
        protocol: "file:",
        slashes: true
      })
    );

    // The following is optional and will open the DevTools:
    win.webContents.openDevTools();

    win.on("closed", () => {
      win = null;
    });

}

function addBeforeSendHeadersCallBack(){
  // Add Origin headers in all requests
  session.defaultSession.webRequest.onBeforeSendHeaders((details, callback) => {
    details.requestHeaders['Origin'] = 'electron://dp5.ziath.com';
    callback({ cancel: false, requestHeaders: details.requestHeaders });
  });
}




// on macOS, closing the window doesn't quit the app
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

//app.commandLine.appendSwitch('disable-gpu-compositing');

if (process.platform === 'linux') {
    app.disableHardwareAcceleration();
}
