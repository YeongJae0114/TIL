const http = require('http');          // HTTP 서버 모듈
const pool = require('./db');          // MySQL 연결 풀 (DB 연결)
const url = require('url');            // URL 파싱 모듈

// HTTP 서버 생성
const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true); // URL 객체로 파싱
    const { pathname } = parsedUrl;             // 요청 경로 추출

    // CORS 및 응답 형식 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');

    // ✅ CORS preflight 요청 대응 (OPTIONS 메서드 처리)
    if (req.method === 'OPTIONS') {
        res.writeHead(200, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        });
        res.end();
        return;
    }

    // ✅ 게시글 목록 조회 (READ)
    else if (req.method === 'GET' && pathname === '/posts') {
        try {
            const [rows] = await pool.query('SELECT * FROM posts'); // 전체 게시글 조회
            res.writeHead(200);
            res.end(JSON.stringify(rows)); // JSON으로 반환
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'DB 조회 실패', details: err.message }));
        }
    }

    // ✅ 게시글 등록 (CREATE)
    else if (req.method === 'POST' && pathname === '/posts') {   
        let body = '';

        // 요청 본문 수신
        req.on('data', chunk => (body += chunk));

        // 본문 수신 완료 시
        req.on('end', async () => {
            try {
                const { title, content } = JSON.parse(body); // JSON → 객체로 파싱
                await pool.query(
                    'INSERT INTO posts (title, content) VALUES (?, ?)',
                    [title, content]
                ); // DB에 게시글 저장

                res.writeHead(201);
                res.end(JSON.stringify({ message: '등록 완료' }));
            } catch (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'DB 등록 실패', details: err.message }));
            }
        });
    }

    // ✅ 게시글 수정 (UPDATE)
    else if (req.method === 'PUT' && pathname.startsWith('/posts/')) {
        const id = pathname.split('/')[2]; // URL에서 게시글 ID 추출
        let body = '';

        // 요청 본문 수신
        req.on('data', chunk => (body += chunk));

        // 본문 수신 완료 시
        req.on('end', async () => {
            try {
                const { title, content } = JSON.parse(body); // JSON → 객체

                const [result] = await pool.query(
                    'UPDATE posts SET title = ?, content = ? WHERE id = ?',
                    [title, content, id]
                ); // 해당 게시글 수정

                if (result.affectedRows === 0) {
                    // 수정할 게시글이 없는 경우
                    res.writeHead(404);
                    res.end(JSON.stringify({ error: '수정할 게시글이 없습니다.' }));
                    return;
                }

                res.writeHead(200);
                res.end(JSON.stringify({ message: '수정 완료' }));
            } catch (err) {
                res.writeHead(500);
                res.end(JSON.stringify({ error: 'DB 수정 실패', details: err.message }));
            }
        });
    }

    // ✅ 게시글 삭제 (DELETE)
    else if (req.method === 'DELETE' && pathname.startsWith('/posts/')) {
        const id = pathname.split('/')[2]; // URL에서 게시글 ID 추출

        try {
            const [result] = await pool.query(
                'DELETE FROM posts WHERE id = ?',
                [id]
            ); // 해당 게시글 삭제

            if (result.affectedRows === 0) {
                // 삭제할 게시글이 없는 경우
                res.writeHead(404);
                res.end(JSON.stringify({ error: '삭제할 게시글이 없습니다.' }));
                return;
            }

            res.writeHead(200);
            res.end(JSON.stringify({ message: '삭제 완료' }));
        } catch (err) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: 'DB 삭제 실패', details: err.message }));
        }
    }

    // ✅ 존재하지 않는 경로 처리
    else {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Not Found' }));
    }
});

// 서버 시작
server.listen(3000, () => {
    console.log('🚀 서버 실행 중: http://localhost:3000');
});
