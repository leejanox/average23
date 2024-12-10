const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');  // mysql2 모듈 import
const fs = require('fs'); // 파일 시스템 모듈
const { spawn } = require('child_process');
const app = express();
const port = 5000;
const path = require('path');

// CORS 허용
app.use(cors());

// JSON 바디 파싱
app.use(express.json());
// MySQL 데이터베이스 연결 설정
const db = mysql.createConnection({
  host: 'localhost',     // MySQL 서버 주소
  user: 'root',          // MySQL 사용자
  password: '1234',          // MySQL 사용자 비밀번호
  database: 'electricity',    // 연결할 데이터베이스 이름 (생성이 되어 있다면 주석해제)
  charset: 'utf8mb4'  // 인코딩 설정
});

// MySQL 연결
db.connect((err) => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

// 예시 API - 사용자 목록을 가져오는 API
app.get('/api/getusers', (req, res) => {
  db.query('SELECT email,pw FROM user', (err, results) => { //email,pw 조회
    if (err) {
      console.error('Error fetching users:', err);
      res.status(500).send('Database query failed');
      return;
    }
    res.json(results);
  });
});

// 예시 API - 사용자 데이터를 받아서 저장하는 API
app.post('/api/addusers', (req, res) => {
    const { name, birth, phone, email, pw, isContent, isLogin } = req.body;
  
    // INSERT 쿼리 수정 (각 컬럼에 맞는 데이터를 삽입)
    const query = 'INSERT INTO user (u_name, birth, phone, email, pw, isContent, isLogin) VALUES (?, ?, ?, ?, ?, ?, ?)';
  
    // db.query()로 쿼리 실행
    db.query(query, [name, birth, phone, email, pw, isContent, isLogin], (err, result) => {
      if (err) {
        console.error('Error inserting user:', err);
        res.status(500).send('Failed to insert user');
        return;
      }
      // 성공적으로 사용자 추가 후 응답
      res.status(201).json({
        id: result.insertId,   // 새로 생성된 ID 반환
        name,
        birth,
        phone,
        email,
        pw,
        isContent,
        isLogin
      });
    });
  });

  app.get('/api/searchfilename', (req, res) => {
    //const {id} = req.body;
    const id = 1

    db.query(`SELECT file_path FROM electricity.files where id like '%${id}%'`, (err, results) => { //email,pw 조회
      if (err) {
        console.error('Error fetching users:', err);
        res.status(500).send('Database query failed');
        return;
      }
      console.log(results[0].file_path)
      const filePath = path.join(__dirname, results[0].file_path);
      res.setHeader('Content-Disposition', `attachment; filename=${파일명}`); // 이게 핵심 
      res.sendFile(filePath);
    });
  });

function sqlexe(sql){ // sql문을 실행할때 if문을 써야하는데 간소화 시키기 위해 함수로 만듬
  db.query(sql, (err) => {
    if (err) {
        console.error(sql+" 에러", err);
    } else {
        console.log(sql+" 완료");
    }
  });
}

function runPython(args) {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['./Learning.py', ...args]);
        let output = '';
        pythonProcess.stdout.on('data', (data) => {
            output += data.toString();
        });
        pythonProcess.stderr.on('data', (data) => {
            reject(data.toString());
        });
        
        pythonProcess.on('close', (code) => {
            if (code === 0) resolve(output);
            else reject(`Python process exited with code ${code}`);
        });
    });
}

app.get('/run-python', async (req, res) => {
  const args = req.query.args ? req.query.args.split(',') : [2020 ,1  ,1  ,1 ,12.0 ,23.9 ,14.1 ,0.9]//[];
  try {
      const result = await runPython(args);
      res.json({ success: true, result });
  } catch (error) {
      res.status(500).json({ success: false, error });
  }
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  // const result2 = runPython([2020 ,1  ,1  ,1 ,12.0 ,23.9 ,14.1 ,0.9]);
  // FirstOrder();
});