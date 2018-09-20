var os = require('os');
var platform = os.platform();
var wget = require('wget-improved');
var arch = require('arch');
var exec = require('child_process').exec;
var execSync = require('child_process').execSync;
var src, output, cmd;

const RELEASES_URL = 'https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download';
const VERSION = '0.12.5';
const VERSION_SUFFIX = '-1';

if (platform === 'darwin') { //OSX
  output = 'wkhtmltopdf.pkg';
  if (arch().indexOf('64') > -1) { //64bit
    src = `${RELEASES_URL}/${VERSION}/wkhtmltox-${VERSION}${VERSION_SUFFIX}.macos-cocoa.pkg`;
  } else { //32bit
    src = `${RELEASES_URL}/${VERSION}/wkhtmltox-${VERSION}${VERSION_SUFFIX}.macos-carbon.pkg`;
  }
  cmd = "installer -pkg wkhtmltopdf.pkg -target /";
} else if (platform === 'win32') { //windows
  // TO DO
  console.warn('win32 OS is not supported');
  process.exit(0);
} else { //linux
  output = 'wkhtmltopdf.deb';
  const release = execSync('lsb_release -a');
  const m = release.match(/^Codename:\s+(\w+)/);
  const distro = m[1].toLowerCase() || ;
  if (arch().indexOf('64') > -1) { //64bit
    src = `${RELEASES_URL}/${VERSION}/wkhtmltox_${VERSION}${VERSION_SUFFIX}.${distro}_amd64.deb`;
  } else { //32bit
    src = `${RELEASES_URL}/${VERSION}/wkhtmltox_${VERSION}${VERSION_SUFFIX}.${distro}_i386.deb`;
  }
  cmd = "apt install ./wkhtmltopdf.deb";
}

var download = wget.download(src, output, {});
download.on('error', function (err) {
  console.log(err);
});
download.on('end', function (output) {
  exec(cmd, function (error, stdout, stderr) {
    if (error) {
      //console.error(`exec error: ${error} ${stdout}`);
      console.log('Installing wkhtmltopdf with sudo command');
      exec("sudo " + cmd, function (error, stdout, stderr) {
        if (error) {
          console.error(`exec error: ${error} ${stdout}`);
          return;
        } else {
          console.log('wkhtmltopdf Successfully installed');
        }
      });
    } else {
      console.log('wkhtmltopdf Successfully installed');
    }
  });
});