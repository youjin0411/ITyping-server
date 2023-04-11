const express = require('express');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const app = express();
const port = process.env.PORT || 7000;

// JSON과 url-encoded 데이터를 파싱할 수 있도록 설정
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 세션 설정
app.use(session({
    secret: 'secret', // 세션 ID를 암호화할 때 사용하는 키
    resave: false, // 변경되지 않은 세션은 저장하지 않도록 설정
    saveUninitialized: false // 초기화되지 않은 세션은 저장하지 않도록 설정
}));

// Passport 초기화 및 세션 사용 설정
app.use(passport.initialize());
app.use(passport.session());

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://w2117:hki050411@cluster0.okgzgum.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
    const usersCollection = client.db("person").collection("users");

    // username 필드에 인덱스 생성
    usersCollection.createIndex({ username: 1 });

    // password 필드에 인덱스 생성
    usersCollection.createIndex({ password: 1 });

    // Passport LocalStrategy 등록
    passport.use(new LocalStrategy(
        (username, password, done) => {
            usersCollection.findOne({ username: username }, (err, user) => {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                if (user.password !== password) { return done(null, false); }
                return done(null, user);
            });
        }
    ));

    // Passport 세션 직렬화 및 역직렬화 설정
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser((id, done) => {
        usersCollection.findOne({ _id: id }, (err, user) => {
            done(err, user);
        });
    });

    // 회원가입 라우트
    app.post('/signup', (req, res) => {
        const { username, password } = req.body;
        usersCollection.findOne({ username }, (err, user) => {
            if (err) {
                return res.status(500).send({ message: err.message });
            }
            if (user) {
                return res.status(400).send({ message: '이미 등록된 사용자입니다.' });
            }
            usersCollection.insertOne({ username, password }, (err, result) => {
                if (err) {
                    return res.status(500).send({ message: err.message });
                }
                res.send({ message: '회원가입이 완료되었습니다.' });
            });
        });
    });

    // 로그인 라우트
    app.post('/login', passport.authenticate('local'), (req, res) => {
        res.send({ message: '로그인되었습니다.' });
    });

    app.listen(port, () => {
        console.log(`Server is listening on port ${port}`);
    });
});