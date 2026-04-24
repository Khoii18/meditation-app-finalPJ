const { exec } = require('child_process');

exec('node app.js', { cwd: 'c:\\Users\\ADMIN\\Desktop\\finalPJ\\meditation-app-finalPJ\\server' }, (err, stdout, stderr) => {
  console.log("STDOUT:", stdout);
  console.error("STDERR:", stderr);
});
