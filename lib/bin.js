#!/usr/bin/env node
const { install, add } = require('./')
const [cmdType, ...args] = process.argv.slice(2);

const cmds = {
	install,
	add
}

const cmd = cmds[cmdType]

if (cmd) {
	cmd(...args)
} else {
	throw console.error(`missing a command type[${Object.keys(cmds).join('|')}]`)
}
