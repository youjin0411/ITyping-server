// 설치 모둘 : npm init -y  
// npm install express cors mongoose body - parser
// 설치 모듈 : npm install express
// 설치 모듈 : npm install cors
// 설치 모듈 : npm install mongoose
// 설치 모듈 : npm install body-parser

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./models/user');

User.find({})
    .then((users) => {
        console.log(users);
    })
    .catch((err) => {
        console.error(err);
    });
const MONGODB_URI = 'mongodb://localhost:27017/myapp'; // URI는 MongoDB 서버 및 데이터베이스 이름을 포함합니다.

// Express 앱 생성
const app = express();

// JSON 데이터를 파싱하기 위한 미들웨어 등록
app.use(bodyParser.json());

// CORS 허용
app.use(cors());

// MongoDB 연결
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://w2117:1234@cluster0.ba9ypbz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// 이 코드는 MongoDB 서버에 연결하고 데이터베이스를 선택합니다.
client.connect(err => {
    const collection = client.db("test").collection("devices");
    // perform actions on the collection object
    client.close();
});

// 회원가입 API
app.post('/api/signup', async(req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send({ message: 'User created' });
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: 'Failed to create user' });
    }
});

// 로그인 API
app.post('/api/login', async(req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).send({ message: 'User not found' });
        }
        if (user.password !== req.body.password) {
            return res.status(401).send({ message: 'Wrong password' });
        }
        res.send({ message: 'Login success' });
    } catch (error) {
        console.error(error);
        res.status(400).send({ message: 'Failed to login' });
    }
});

// 서버 실행
app.listen(6000, () => {
    console.log('Server started on port 3000');
});