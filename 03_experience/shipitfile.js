module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
    },
    staging: {
      servers: 'root@107.170.19.138'
    },
    production : {
      servers : 'huia@52.42.29.202'
    }
  });


  shipit.blTask('deployLocal', function(){
    console.log("building local...");
    return shipit.local('npm run build');
  });

  shipit.blTask('copyRemote', function(){
    console.log("copying files to remote...");
    shipit.remoteCopy('./dist/*', '/var/www/site');
  });

  shipit.blTask('copyServer', function(){
    console.log('copying server...');
    shipit.remoteCopy('./server.js', '/var/www/site/').then(function(){
      shipit.remoteCopy('./package.json', '/var/www/site/')
    });
  });

  shipit.blTask('npmServer', function(){
    console.log('npm install in server...');
    shipit.remote('cd /var/www/site').then(function(){
      shipit.remote('npm install');
    });
  });


  shipit.task('deploy', function(){
    shipit.start(['deployLocal','copyRemote']);
  });
};
