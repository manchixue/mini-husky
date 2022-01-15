const cp = require('child_process')
const git = (args) => cp.spawnSync('git', args, { stdio: 'inherit' });
const fs = require('fs');
const path = require('path');
const cwd = process.cwd();

exports.install = function install (dir = '.myhusky') {
	const huskyP = path.resolve(cwd, dir)
	if (!fs.existsSync(path.join(cwd, '.git'))) {
		throw new Error('cannot find .git directory');
	}

	// 创建hooksPath文件夹
	fs.mkdirSync(huskyP)

	// git config core.hooksPath dir 设置git hooks触发文件目录
	git(['config', 'core.hooksPath', dir])
}

exports.add = function add (file, cmd) {
	// 追加命令函数
	// 往git hooks目录下追加 `commit-msg` 脚本
	fs.writeFileSync(
		path.join(cwd, file), `#!/bin/sh
${cmd}`, { mode: 0o0755 }
	)
}
