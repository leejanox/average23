const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');  // mysql2 모듈 import
const fs = require('fs'); // 파일 시스템 모듈
const { spawn } = require('child_process');
const app = express();
const port = 5000;
const path = require('path');
const jwt = require('jsonwebtoken');  // token 용
const nodemailer = require("nodemailer");
const bcrypt =require('bcrypt');//비밀번호 해시 npm install bcrypt
//require('dotenv').config();//환경변수 로드 

// CORS 허용
app.use(cors());

// JSON 바디 파싱
app.use(express.json());
// MySQL 데이터베이스 연결 설정
const db = mysql.createPool({
  connectionLimit:10, //pool 설정
  host: 'localhost',     // MySQL 서버 주소
  user: 'root',          // MySQL 사용자
  password: '1234',          // MySQL 사용자 비밀번호
  database: 'electricity',    // 연결할 데이터베이스 이름 (생성이 되어 있다면 주석해제)
  charset: 'utf8mb4',  // 인코딩 설정
  waitForConnections: true,
  queueLimit: 0,
  connectTimeout: 10000, // 연결 타임아웃(ms)
});


// Nodemailer 설정

const { email_service, user, pass } = process.env;

const transporter = nodemailer.createTransport({
  service: email_service,
  port: 3001, //  MailDev SMTP 포트
  secure: false, // TLS 사용 여부
  auth: {
    user: user,
    pass: pass, 
  },
});

//cmd : maildev --smtp=3001 --web=9090  , Web UI: http://localhost:9090

 
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP 연결 실패:", error);
  } else {
    console.log("SMTP 연결 성공!");
  }
});

//jws Token
const JWT_SECRET = 'your_secret_key';

// 로그인 API
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "이메일과 비밀번호를 입력하세요." });
  }

  try {
    const [rows] = await db.query("SELECT * FROM user WHERE email = ?", [email]);

    if (rows.length === 0) {
      return res.status(401).json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    const user = rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "이메일 또는 비밀번호가 잘못되었습니다." });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });

    res.status(200).json({
      message: "로그인 성공",
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("로그인 처리 중 오류 발생:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// 회원가입 API
app.post("/api/signup", async (req, res) => {
  const { username, birth, email, password, phone } = req.body;

  if (!username || !birth || !email || !password || !phone) {
    return res.status(400).json({ message: "모든 필드를 입력하세요." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = "INSERT INTO user (username, birth, email, password, phone) VALUES (?, ?, ?, ?, ?)";
    const [result] = await db.query(query, [username, birth, email, hashedPassword, phone]);

    res.status(200).json({
      message: "회원가입 성공",
      id: result.insertId,
      username,
      birth,
      email,
      phone,
    });
  } catch (error) {
    console.error("회원가입 처리 중 오류:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// ID 찾기 API
app.post("/api/find-id", async (req, res) => {
  const { username, birth, phone } = req.body;

  try {
    const [rows] = await db.query(
      "SELECT email FROM user WHERE username = ? AND birth = ? AND phone = ?",
      [username, birth, phone]
    );

    if (rows.length > 0) {
      return res.status(200).json({ email: rows[0].email });
    } else {
      return res.status(404).json({ message: "사용자 정보를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("ID 찾기 실패:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

// 비밀번호 재설정 API
app.post("/api/reset-password", async (req, res) => {
  const { email, username } = req.body;

  try {
    const [rows] = await db.query("SELECT id FROM user WHERE email = ? AND username = ?", [email, username]);

    if (rows.length > 0) {
      const mailOptions = {
        from: process.env.EMAIL_USER || "your_email",
        to: email,
        subject: "비밀번호 재설정",
        text: `안녕하세요, ${username}. 아래 링크를 통해 비밀번호를 재설정하세요: http://localhost:5000/reset-password`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error("이메일 전송 실패:", error);
          return res.status(500).json({ message: "이메일 전송 실패" });
        } else {
          console.log("이메일 전송 성공:", info.response);
          res.status(200).json({ message: "비밀번호 재설정 이메일 발송 성공" });
        }
      });
    } else {
      res.status(404).json({ message: "사용자 정보를 찾을 수 없습니다." });
    }
  } catch (error) {
    console.error("비밀번호 재설정 실패:", error);
    res.status(500).json({ message: "서버 오류가 발생했습니다." });
  }
});

  //파일 목록 불러오기
  app.get("/api/fetchfilelist", async (req, res) => {
    try {
      const query = "SELECT * FROM files";
      const [result] = await db.query(query); // Promise 기반
      res.status(200).json(result); // 200으로 변경
    } catch (err) {
      console.error("files 테이블 조회 오류:", err);
      res.status(500).json({ message: "조회 SQL 쿼리 실행 실패" });
    }
  });

  //파일 다운로드 드롭다운 버튼에 들어갈 옵션

  app.get("/api/fetchOptions", async (req, res) => {
    try {
      const query = "SELECT DISTINCT sectiontype FROM files";
      const [result] = await db.query(query); // Promise 기반
      res.status(200).json(result); // 200으로 변경
    } catch (err) {
      console.error("files Table sectiontype 조회 오류:", err);
      res.status(500).json({ message: "옵션 조회 쿼리 실패" });
    }
  });

  //선호작 불러오기
  app.post("/api/favoritelist", async (req, res) => {
    const { userId } = req.body;
  
    if (!userId) {
      return res.status(400).json({ message: "로그인 상태인지 확인 바람" });
    }
  
    try {
      const query = "SELECT * FROM favorite INNER JOIN files ON favorite.f_id = files.id WHERE u_id = ?";
      const [results] = await db.query(query, [userId]); // Promise 기반
  
      if (results.length === 0) {
        return res.status(404).json({ message: "선호작이 없습니다." });
      }
  
      const favorites = results.map((row) => ({
        u_id: row.u_id,
        f_info: {
          f_id: row.f_id,
          filename: row.filename,
          sectiontype: row.sectiontype,
        },
      }));
  
      res.status(200).json({
        message: "data fetch success",
        favorites,
      });
    } catch (err) {
      console.error("favorite table 조회 오류:", err);
      res.status(500).json({ message: "favorite table 조회 오류" });
    }
  });

  //선호작 추가 
  app.post("/api/addFavorite", async (req, res) => {
    const { userId, fileId } = req.body;
  
    if (!userId || !fileId) {
      return res.status(400).json({ message: "Missing userId or fileId" });
    }
  
    try {
      const query = "INSERT INTO favorite (u_id, f_id) VALUES (?, ?)";
      await db.query(query, [userId, fileId]); // Promise 기반
      res.status(200).json({ message: "Favorite added successfully" });
    } catch (err) {
      console.error("Add favorite 실패:", err);
      res.status(500).json({ message: "Failed to add favorite" });
    }
  });
  

// 파일 다운로드 처리

app.get("/api/downloadfile/:id", async (req, res) => {
  const fileId = req.params.id;

  try {
    const [rows] = await db.query("SELECT filename, download_url FROM files WHERE id = ?", [fileId]);
    if (rows.length === 0) {
      return res.status(404).json({ message: "파일을 찾을 수 없습니다." });
    }

    const file = rows[0];
    // 절대 경로 생성: 루트 디렉토리에서 download_url에 있는 상대 경로를 절대 경로로 변환
    const filePath = path.resolve(__dirname, '../', file.download_url);

    console.log("다운로드 파일 절대 경로:", filePath); // 파일 경로 로그 출력

    res.download(filePath, file.filename, (err) => {
      if (err) {
        console.error("파일 다운로드 실패:", err);
        res.status(500).json({ message: "파일 다운로드 실패" });
      }
    });
  } catch (err) {
    console.error("파일 다운로드 실패:", err);
    res.status(500).json({ message: "파일 다운로드 실패" });
  }
});

  /*파일 다운로드_2
  
  app.get('/api/downloadfile', (req, res) => {
    const ids = req.query.id ? req.query.id.split('&').map(id => id.split('=')[1]) : []; // id 쿼리 파라미터가 여러 개일 때 처리
  
    if (ids.length === 0) {
      return res.status(400).send('ID is required');
    }
  
    // SQL 쿼리에서 IN 조건을 사용하여 여러 id를 처리
    const query = `SELECT id, filename, file_path, mime_type FROM electricity.files WHERE id IN (${ids.map(id => `'${id}'`).join(', ')})`;
  
    db.query(query, (err, results) => {
      if (err) {
        console.error('Error fetching file data:', err);
        res.status(500).send('Database query failed');
        return;
      }
  
      if (results.length === 0) {
        return res.status(404).send('File not found');
      }
  
      // 데이터베이스 결과에서 필요한 값 추출
      const files = results.map(file => ({
        id: file.id,
        fn: file.filename, // filename
        fp: file.file_path, // filepath
        ft: file.mime_type  // mime_type
      }));
  
      // 클라이언트에 파일 데이터 반환
      res.json(files); // 여러 파일을 배열 형태로 반환
    });
  });
*/


// 서버 실행
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    // const result2 = runPython([2020 ,1  ,1  ,1 ,12.0 ,23.9 ,14.1 ,0.9]);
    // FirstOrder();
  });