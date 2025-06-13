const mysql = require('mysql2'); // ① mysql2 모듈 불러오기

const pool = mysql.createPool({   // ② 커넥션 풀 생성
  host: 'localhost',
  user: 'root',
  password: 'dudwo',
  database: 'jsboard',
  waitForConnections: true,       // 연결이 부족하면 대기할지 여부
  connectionLimit: 10,            // 최대 연결 수
});

// ③ pool.promise()로 async/await 방식의 연결 객체 반환
module.exports = pool.promise();
