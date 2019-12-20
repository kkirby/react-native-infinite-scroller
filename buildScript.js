const shell = require('shelljs');
const path = require('path');

shell.exec('npm run build:types', {
	fatal: true,
});
shell.exec('npm run build:js', {
	fatal: true,
});
shell.rm(path.join(__dirname, 'lib', 'AnimationLogic', 'index.d.js'));
shell.cp(
	path.join(__dirname, 'src', 'AnimationLogic', 'index.d.ts'),
	path.join(__dirname, 'lib', 'AnimationLogic', 'index.d.ts'),
);
