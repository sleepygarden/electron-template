function run_cmd(cmd, args, callBack ) {
    var spawn = require('child_process').spawn;
    var child = spawn(cmd, args);
    var resp = "";

    child.stdout.on('data', function (buffer) { resp += buffer.toString(); });
    child.stdout.on('end', function() { callBack (resp); });
    return child;
}

function latestElectronVersion(versionCallback){
    var proc, timeout;
    console.log('Looking up latest Electron version...');
    proc = run_cmd('npm',['view','electron-prebuilt','version'],function(versionString){
        versionCallback(versionString.trim());
        clearTimeout(timeout);
    });
    timeout = setTimeout(function() {
        console.error('Latest Electron version lookup timed out');
        proc.kill();
        process.exit(1);
    }, 1000 * 10); // 10s
}

function localElectronVersion(versionCallback){
    console.log('Looking up local Electron version...');
    run_cmd('npm',['list', 'electron-prebuilt', '--json'], function(json){
        versionCallback(JSON.parse(json).dependencies['electron-prebuilt'].version);
    });
}

function build(options){
    require('electron-packager')(options, function(err, appPaths){
        if (err) {
            if (err.message) {
                console.error(err.message);
            }
            else {
                console.error(err, err.stack);
            }
            process.exit(1);
        }

        if (appPaths.length > 1) {
            console.error('Wrote new apps to:\n' + appPaths.join('\n'));
        }
        else if (appPaths.length === 1) {
            console.error('Wrote new app to', appPaths[0]);
        }
    });
}

var package = require('./package.json');
latestElectronVersion(function(version){
    build({
        'platform': 'darwin',
        'arch': 'x64',
        'version': version,
        'name': package.name,
        'app-version': package.version,
        'dir': './',
        'out': './build',
        'ignore': '\.\/build',
        'overwrite': true,
        'icon': 'Icon.icns',
        'prune' : true
    });
});
