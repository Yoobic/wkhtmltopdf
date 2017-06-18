var os = require('os');
var platform = os.platform();
var wget = require('wget-improved');
var arch = require('arch');
var exec = require('child_process').exec;
var src, output, cmd;

const RELEASES_URL = 'https://github.com/wkhtmltopdf/wkhtmltopdf/releases/download';
const VERSION = '0.12.3';

if (platform === 'darwin') { //OSX
  output = 'wkhtmltopdf.pkg';
  if (arch().indexOf('64') > -1) { //64bit
    src = `${RELEASES_URL}/${VERSION}/wkhtmltox-${VERSION}_osx-cocoa-x86-64.pkg`;
  } else { //32bit
    src = `${RELEASES_URL}/${VERSION}/wkhtmltox-${VERSION}_osx-carbon-i386.pkg`;
  }
  cmd = "installer -pkg wkhtmltopdf.pkg -target /";
} else if (platform === 'win32') { //windows
  // TO DO
  console.warn('win32 OS is not supported');
  process.exit(0);
} else { //linux
  output = 'wkhtmltopdf.tar.xz';
  if (arch().indexOf('64') > -1) { //64bit
    src = `${RELEASES_URL}/${VERSION}/wkhtmltox-${VERSION}_linux-generic-amd64.tar.xz`;
  } else { //32bit
    src = `${RELEASES_URL}/${VERSION}/wkhtmltox-${VERSION}_linux-generic-i386.tar.xz`;
  }
  cmd = "tar -xvf wkhtmltopdf.tar.xz -C bin";
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