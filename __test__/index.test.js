const cp = require('child_process')
const fs = require('fs')
const path = require('path')
const { install, add } = require('../lib/index')
const shell = require('shelljs')
const hooksDir = '.myhusky'
const removeFile = p => shell.rm('-rf', p)
const git = args => cp.spawnSync('git', args, { stdio: 'inherit' });
const reset = () => {
  const cwd = process.cwd()
  const absPath = path.resolve(cwd, hooksDir)

  removeFile(absPath)
  git(['config', '--unset', 'core.hooksPath'])
}

beforeAll(() => {
  process.chdir(path.resolve(__dirname, '../'))
})
// 每个单测都会执行的函数
beforeEach(() => {
  reset()
  install(hooksDir) // 执行 install
})
// 测试 install 命令
test('install cmd', async () => {
  // install 逻辑在每个单测开始前都会执行, 所以当前测试用例只需要对结果进行检测
  const pwd = process.cwd()
  const huskyDirP = path.resolve(pwd, hooksDir)
  const hasHuskyDir = fs.existsSync(huskyDirP) && fs.statSync(huskyDirP).isDirectory()
  // 读取 git config 文件信息
  const gitConfigFile = fs.readFileSync(path.resolve(pwd, '.git/config'), 'utf-8')
  // git config 文件需要含有 hooksPath配置
  expect(gitConfigFile).toContain('hooksPath = .myhusky')
  // 期望含有新创建的 git hooks 文件夹
  expect(hasHuskyDir).toBeTruthy()
})
// 测试 add 命令
test('add cmd work', async () => {
  const hookFile = `${hooksDir}/commit-msg`
  const recordCurCommit = git(['rev-parse', '--short', 'HEAD'])
  // 往commit-msg文件写入脚本内容， exit 1
  add(hookFile, 'exit 1')
  git(['add', '.'])
  // 执行 git commit 操作触发钩子
  const std = git(['commit', '-m', 'fail commit msg'])
  // 查看进程返回的状态码
  expect(std.status).toBe(1)
  // 清除当前测试用例的副作用
  git(['reset', '--hard', recordCurCommit])
  removeFile(hookFile)
})
