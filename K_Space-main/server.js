const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const simpleGit = require('simple-git');
const path = require('path');
const app = express();
const git = simpleGit();

app.use(bodyParser.json());

// 提供静态文件
app.use(express.static('.', {
  setHeaders: function (res, path, stat) {
    console.log('Serving static file:', path);
  }
}));

// 允许跨域（如果前端和后端端口不同）
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// 读取 topics.json
app.get('/api/topics', (req, res) => {
  const filePath = path.join(__dirname, 'topics.json');
  if (fs.existsSync(filePath)) {
    res.json(JSON.parse(fs.readFileSync(filePath, 'utf-8')));
  } else {
    res.json([]);
  }
});

// 保存 topics.json
app.post('/api/save-topics', (req, res) => {
  fs.writeFileSync('topics.json', JSON.stringify(req.body, null, 2), 'utf-8');
  res.json({ok: true});
});

// git add/commit/push
app.post('/api/git-push', async (req, res) => {
  try {
    await git.add('topics.json');
    await git.commit('update topics');
    await git.push();
    res.json({ok: true});
  } catch (e) {
    res.status(500).json({ok: false, error: e.message});
  }
});

// 测试路由
app.get('/test', (req, res) => {
  res.send('Test route works!');
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));