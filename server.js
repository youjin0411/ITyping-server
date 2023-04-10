import axios from 'axios';
const oracledb = require('oracledb');

const conn = await oracledb.getConnection({
    user: 'Ityping',
    password: '1234',
    connectString: 'localhost:1521/orcl'
});

// 데이터베이스 연결 테스트
conn.execute(
    `SELECT *
   FROM person`,
    (err, result) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log(result.rows);
    }
);

//회원가입 하기 
app.post('/signup', async(req, res) => {
    const { username, password, email } = req.body;

    try {
        const conn = await oracledb.getConnection({
            user: 'Ityping',
            password: '1234',
            connectString: 'localhost:1521/orcl'
        });

        await conn.execute(
            `INSERT INTO person (id, email, pw)
       VALUES (:username, :password, :email)`, [username, password, email]
        );

        res.json({ success: true });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to sign up' });
    }
});

// 로그인하기 
app.post('/login', async(req, res) => {
    const { username, password } = req.body;

    try {
        const conn = await oracledb.getConnection({
            user: 'Ityping',
            password: '1234',
            connectString: 'localhost:1521/orcl'
        });

        const result = await conn.execute(
            `SELECT *
       FROM person
       WHERE email = :username AND pw = :password`, [username, password]
        );

        if (result.rows.length === 1) {
            res.json({ success: true });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to log in' });
    }
});

//React와 연결하기
axios.post('/signup', { username, password, email })
    .then((res) => {
        console.log(res.data);
    })
    .catch((err) => {
        console.error(err);
    });