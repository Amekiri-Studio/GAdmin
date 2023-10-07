const { spawn } = require('child_process');

const command = 'mangohud';
const args = [
    'wine',
    '/mnt/Amekiri/Game/Senren Banka [VN][Yuzusoft][18+][eng]/SenrenBanka/SenrenBanka.exe',
  ];

const options = {
    env:{
        MANGOHUD:1,
        ...process.env
    }
};

const child = spawn(command, args, options);

// 监听子进程的标准输出
child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
});

// 监听子进程的标准错误输出
child.stderr.on('data', (data) => {
  console.error(`stderr: ${data}`);
});

// 子进程退出时触发
child.on('close', (code) => {
  console.log(`子进程退出，退出码 ${code}`);
});