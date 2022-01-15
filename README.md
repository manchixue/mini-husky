# mini-husky

install pnpm first
```shell
npm install pnpm -g
```

### start

```shell
pnpm install
pnpm test
```

### 如何测试效果

- 将当前包进行 npm link
- 到项目下进行 npm link myhusky 操作

### Usage
Edit package.json > prepare script and run it once:

```shell
npm set-script prepare "myhusky install"
npm run prepare
```
Add a hook:

```shell
npx husky add .husky/pre-commit "npm test"
git add .husky/pre-commit
```

Make a commit:

```shell
git commit -m "Keep calm and commit"
# `npm test` will run every time you commit
```
