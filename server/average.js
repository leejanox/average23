require('dotenv').config();
const express = require('express');
const cookieParser = require("cookie-parser"); //npm install cookie-parser
const cors = require('cors');
const mysql = require('mysql2/promise');//mysql
const app = express();
const port = 5000;
const path = require('path');
const jwt = require('jsonwebtoken');// token 
const nodemailer = require("nodemailer");
const bcrypt =require('bcrypt');//pw hash
const { spawn } = require('child_process');//python script 실행
//nodemon : npm run dev

/* setting */
// CORS 
app.use(cors({
    //client 3000 request 만 처리
    origin: 'http://localhost:3000', 
    credentials: true,
}));

app.use(cookieParser());

//json body parsing
app.use(express.json());

//mysql connect
const db = mysql.createPool({
    connectionLimit:10, //pool 
    host: 'localhost',     // MySQL server adress
    user: 'root',          // MySQL user
    password: '1234',          // MySQL user pw
    database: 'electricity',    // database
    charset: 'utf8mb4',  //encoding
    waitForConnections: true,
    queueLimit: 0,
    connectTimeout: 10000, // timeout(ms)
  });

//nodemailer setting - cmd: maildev --smtp=3001 --web=9090, Web UI: http://localhost:9090
//pw reset

const { email_service, user, pass } = process.env; //.env - gmail| mail 보낼 email,pw info

const transporter = nodemailer.createTransport({
  service: email_service,
  port: 3001, //  MailDev SMTP port
  secure: true, // TLS 사용 여부
  auth: {
    user: user,
    pass: pass, 
  },
});

//node average.js 할때 smtp connect 여부 check
transporter.verify((error, success) => {
    if (error) {
      console.error("SMTP connect fail:", error);
    } else {
      console.log("SMTP connect success");
    }
  });

//query 사용시 ? 사용으로 입력값 자동 escaping -> security

/* signuppage */
//signup API
app.post("/api/signup", async (req, res) => {
    //receive user sginup form
    const { username, birth, email, password, phone } = req.body;
    //user signup form -> X ->err
    if (!username || !birth || !email || !password || !phone) {
        return res.status(400).json({ message: "모든 필드를 입력하세요." });
    }
  
    try {
        //pw hash -> save :security
        const hashedPassword = await bcrypt.hash(password, 10);
        //save query : user table
        const query = "INSERT INTO user (username, birth, email, password, phone) VALUES (?, ?, ?, ?, ?)";
        //query 실행 result
        const [result] = await db.query(query, [username, birth, email, hashedPassword, phone]);
        //send success status -> pw 제외하고 반환
        res.status(200).json({
            message: "회원가입 성공",
            id: result.insertId,
            username,
            birth,
            email,
            phone,
        });
    } catch (error) {//err
        console.error("회원가입 처리 중 오류:", error);
        //send fail status
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});

/* loginpage */
//jws token - login statue check
const JWT_SECRET = 'your_secret_key';

//login API
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
  
      // HttpOnly 쿠키로 JWT 저장 ->client 에서는 브라우저에 자동으로 쿠키 전송 -> 로컬스토리지에 따로 저장 x
      //브라우저 내에서 실행되는 JavaScript가 토큰을 훔쳐가는 것을 방지
      //HttpOnly 쿠키는 클라이언트 측 스크립트로 접근할 수 없고, 브라우저가 자동으로 요청 헤더에 포함시켜 서버에 전송
      res.cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== "production", //개발 환경에서 http로 전송되도록 설정
        //secure: process.env.NODE_ENV === "production", // 프로덕션 환경에서만 secure 사용
        sameSite: 'strict', // CSRF 방지용 설정
        //CSRF 공격은 보통 사용자가 로그인된 상태에서 다른 사이트의 악성 스크립트가 사용자의 브라우저를 이용하여 공격을 시도할 때 발생
        //SameSite의 옵션 3가지:
        //1.Strict: 쿠키가 동일한 사이트에서만 사용되도록 제한
        //2.Lax: 일부 사용자 상호작용(예: GET 요청 등)에 한해서는 쿠키가 동일한 사이트가 아닌 경우에도 사용이 가능,
        //3.None: 다른 사이트에서도 쿠키가 사용될 수 있도록 허용하지만, secure 옵션이 함께 설정
      });
  
      res.status(200).json({
        message: "로그인 성공",
        user: {
          id: user.id,
          name: user.username,
          email: user.email,
        },
      });
      console.log("유저 정보: ",{
        id:user.id,
        name:user.username,
        email:user.email
    });
    } catch (error) {
      console.error("로그인 처리 중 오류 발생:", error);
      res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});
  
/* check Auth -API */
app.get("/api/check-auth", (req, res) => {
    const token = req.cookies.token;
    if (!token) {
      console.error("토큰 없음");
      return res.status(401).json({ message: "로그인이 필요합니다." });
    }
  
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      console.log("토큰 검증 성공:", decoded); // 로그로 확인
      res.status(200).json({ user: { id: decoded.id, email: decoded.email } });
    } catch (err) {
      console.error("토큰 검증 실패:", err); // 로그로 확인
      res.status(401).json({ message: "유효하지 않은 토큰입니다." });
    }
  });

//find email API
app.post("/api/find-id", async (req, res) => {
    //id find : username,birth,phone check
    const { username, birth, phone } = req.body;
    
    try {
        const [rows] = await db.query(
            //db query: name, birth,phone search
            "SELECT email FROM user WHERE username = ? AND birth = ? AND phone = ?",
            [username, birth, phone]
        );
        //success
        if (rows.length > 0) {
            //일치하는 user 존재 ->send user email 
            return res.status(200).json({ email: rows[0].email });
        } else {
            //일치하는 user X ->err
            return res.status(404).json({ message: "사용자 정보를 찾을 수 없습니다." });
        }
    } catch (error) {
        //fail
        console.error("ID 찾기 실패:", error);
        //send fail status
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});

/* logout- API */
app.post("/api/logout", (req, res) => {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: 'strict',
    });
    res.status(200).json({ message: "로그아웃 성공" });
});
  

//pw reset send email- API
app.post("/api/resetpassword", async (req, res) => {
    //nodemailer -> send reset url 
    const { email} = req.body;
  
    try {
        console.log("사용자가 입력한 이메일: ",req.body);
        //가입user check query -> user email,name search
        const [rows] = await db.query("SELECT email FROM user WHERE email = ?", [email]);
        //query success
        if (rows.length > 0) {
        //전송할 mail options setting
        const mailOptions = {
            //.env : mail 전송할 email
            from: process.env.EMAIL_USER,
            //user email
            to: email,
            //send subject
            subject: "비밀번호 재설정",
            //send content
            text: `안녕하세요, ${username}. 아래 링크를 통해 비밀번호를 재설정하세요: http://localhost:5000/reset-password`,
            };
            //send mail
            transporter.sendMail(mailOptions, (error, info) => {
                //fail
                if (error) {
                    console.error("이메일 전송 실패:", error);
                    //send status -> X -> err
                    return res.status(500).json({ message: "이메일 전송 실패" });
                } else {
                    //success
                    console.log("이메일 전송 성공:", info.response);
                    //send success status
                    res.status(200).json({ message: "비밀번호 재설정 이메일 발송 성공" });
                    }
                });
        } else {
            //fail query -> err
            res.status(404).json({ message: "사용자 정보를 찾을 수 없습니다." });
        }
    } catch (error) {
        console.error("비밀번호 재설정 실패:", error);
        //fail status -> err
        res.status(500).json({ message: "서버 오류가 발생했습니다." });
    }
});

/* downloadpage */
//fetch filelist API 
app.get("/api/fetchfilelist", async (req, res) => {
    try {
        //send all query result
        const [result] = await db.query("SELECT * FROM files");
        //success status
        res.status(200).json(result);
    } catch (err) {
        console.error("files table 조회 fail:", err);
        //fail status  -> err
        res.status(500).json({ message: "불러올 download filelist 가 없습니다." });
    }
});

//filelist filter option API : type( client, server, db )
app.get("/api/fetchOptions", async (req, res) => {
    try {
        //sectiontype = foldername ... 중복 제외
        const [result] = await db.query("SELECT DISTINCT sectiontype FROM files");
        //success status -> send filter option 
        res.status(200).json(result);
    } catch (err) {
        console.error("files table sectiontype 조회 오류:", err);
        //fail status -> err
        res.status(500).json({ message: "옵션 조회 실패" });
    }
});

//download file
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
  
        //console.log("다운로드 파일 절대 경로:", filePath); // 파일 경로 로그 출력
  
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

/* user profile(favorite) */
//fetch facoritelist API
app.post("/api/favoritelist", async (req, res) => {
    //favorite table search -> u_id
    const { userId } = req.body;
    //u_id -> X = login status X
    if (!userId) {
        return res.status(400).json({ message: "로그인 상태인지 확인 바랍니다." });
    }
  
    try {
        //login userid와 favorite table u_id가 같은 data중 favorite table f_id 와 같은 files table f_id의 filename, sectiontype search
        const [results] = await db.query("SELECT * FROM favorite INNER JOIN files ON favorite.f_id = files.id WHERE u_id = ?", [userId]);
        //favorite data X
        if (results.length === 0) {
            return res.status(404).json({ message: "선호작이 없습니다." });
        }
        //row 한개씩 []로 전송
        const favorites = results.map((row) => ({
                u_id: row.u_id,
                f_info: {
                    f_id: row.f_id,
                    filename: row.filename,
                    sectiontype: row.sectiontype,
                },
            }
        ));
        //success
        res.status(200).json({
            message: "favorites data fetch success",
            favorites,
        });
    } catch (err) {
        //fail
        console.error("favorite table 조회 오류:", err);
        res.status(500).json({ message: "favorite table 조회 오류" });
    }
});

//affectedRows? db query 실행 -> 변경된 row 수를 나타내는 속성 INSERT,UPDATE,DELETE 에서 변경된 행의 개수를 반환
//add favorite API
app.post("/api/addFavorite", async (req, res) => {
    //추가할 f_id와 요청 보낸 userid
    const { userId, fileId } = req.body;
    if (!userId || !fileId) {
        return res.status(400).json({ message: "userId or fileId가 없습니다."});
    }
    try {
        const [result] = await db.query("INSERT INTO favorite (u_id, f_id) VALUES (?, ?) ON DUPLICATE KEY UPDATE u_id = u_id", [userId, fileId]);
        // affectedRows check
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "선택한 파일이 선호작리스트에 추가되었습니다." });
        } else {
            res.status(200).json({ message: "이미 리스트에 존재하는 파일입니다." });
        }
    } catch (err) {
        console.error("Add favorite 실패:", err);
        res.status(500).json({ message: "선호작리스트에 추가하지 못했습니다." });
    }
});

//delete favorite API
app.post("/api/removeFavorite", async (req, res) => {
    // delete f_id와 요청  userid
    const { userId, fileId } = req.body;

    if (!userId || !fileId) {
        return res.status(400).json({ message: "userId or fileId가 없습니다." });
    }

    try {
        //일치하는 u_id의 f_id 삭제
        const [result] = await db.query("DELETE FROM favorite WHERE u_id = ? AND f_id = ?", [userId, fileId]);

        //fail
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "리스트에 존재하지 않는 파일입니다." });
        }

        // success
        res.status(200).json({ message: "파일이 선호작 리스트에서 삭제되었습니다." });
    } catch (err) {
        console.error("Remove favorite 실패:", err);
        res.status(500).json({ message: "삭제 실패" });
    }
});

/* AImodel-run API */
app.post("/api/predict", (req, res) => {
    const { features } = req.body;

    console.log(req.body);
    // 요청 데이터 검증
    if (!features || !Array.isArray(features)) {
        return res.status(400).json({ message: "Invalid input data. 'features' must be an array." });
    }

    // Python 스크립트를 실행
    const pythonProcess = spawn("python3", ["Learning.py", ...features]);

    let predictionResult = "";
    pythonProcess.stdout.on("data", (data) => {
        predictionResult += data.toString();
    });

    pythonProcess.stderr.on("data", (data) => {
        console.error(`Error: ${data}`);
    });

    pythonProcess.on("close", (code) => {
        if (code === 0) {
            // Python 스크립트 실행 성공
            const predictions = predictionResult.trim().split(",").map(Number); // 예측 결과를 배열로 변환
            res.status(200).json({ predictions });
        } else {
            // Python 스크립트 실행 실패
            res.status(500).json({ message: "Failed to execute prediction model." });
        }
    });
});

/* ai-data API */
app.get("/api/fetchelectrodata1", async (req, res) => {
    try {
        // Query execution
        const [rows] = await db.query(
            `SELECT 
                Year, 
                계약종별.name AS Contracttype, 
                시군구.name AS City, 
                시도.name AS Attemp,
                1월, 2월, 3월, 4월, 5월, 6월, 7월, 8월, 9월, 10월, 11월, 12월
            FROM \`전력소비2017~2020\` AS a 
            INNER JOIN \`계약종별\` ON a.Contracttype = \`계약종별\`.no 
            INNER JOIN \`시군구\` ON a.City = \`시군구\`.no 
            INNER JOIN \`시도\` ON a.Attempt = \`시도\`.no 
            LIMIT 14;`
        );
  
        // Transform the data into the desired format
        const result = rows.map(row => ({
            year: row.Year,
            contracttype: row.Contracttype,
            city: row.City,
            attemp: row.Attemp,
            month: {
                "1월": row["1월"],
                "2월": row["2월"],
                "3월": row["3월"],
                "4월": row["4월"],
                "5월": row["5월"],
                "6월": row["6월"],
                "7월": row["7월"],
                "8월": row["8월"],
                "9월": row["9월"],
                "10월": row["10월"],
                "11월": row["11월"],
                "12월": row["12월"]
            }
        }));
  
        // Send the transformed result
        res.status(200).json(result);
    } catch (err) {
        console.error("files table 조회 fail:", err);
        res.status(500).json({ message: "불러올 download filelist 가 없습니다." });
    }
  });
  
  app.get("/api/fetchelectrodata2", async (req, res) => {
    try {
        //send all query result
        const [result] = await db.query("SELECT no as id, name FROM 계약종별");
        //success status
        res.status(200).json(result);
    } catch (err) {
        console.error("files table 조회 fail:", err);
        //fail status  -> err
        res.status(500).json({ message: "불러올 download filelist 가 없습니다." });
    }
  });
  
  app.get("/api/fetchelectrodata3", async (req, res) => {
    try {
        //send all query result
        const [result] = await db.query("SELECT no as id, name FROM 시도");
        //success status
        res.status(200).json(result);
    } catch (err) {
        console.error("files table 조회 fail:", err);
        //fail status  -> err
        res.status(500).json({ message: "불러올 download filelist 가 없습니다." });
    }
  });
  
  app.get("/api/fetchelectrodata4", async (req, res) => {
    try {
        //send all query result
        const [result] = await db.query("SELECT * FROM 계절평균기온");
        //success status
        res.status(200).json(result);
    } catch (err) {
        console.error("files table 조회 fail:", err);
        //fail status  -> err
        res.status(500).json({ message: "불러올 download filelist 가 없습니다." });
    }
});

//run server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });