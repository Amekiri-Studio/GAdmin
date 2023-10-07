const { spawn } = require('child_process');

let child = spawn("TEST_ENV=1 wine '/mnt/Amekiri/Game/CafeStella/CafeStella.exe'", {
    shell:true
});

child.stdout.on('data', data => {
    console.log(`${data}`);
})

child.on('close', (code) => {
    console.log(`子进程退出，退出码 ${code}`);
  });