### 클라이언트가 로그인 했다는 정보를 계속 유지라려면? 
로그인 상태를 서버가 기억하고 있다고, 요청이 들어오면 이미 인증이 됐다고 판단.

1.  session 정보를 유지하면 됨. 
2.  session 정보는 서버 메모리에 저장하거나 db에 보관
3.  로그인 이후 요청시 세선저장소에서 세션정보를 확인하고 응답

### 세션방식의 한계

아직까지도 많이 사용되는 세션방식은 이런 문제들이 존재.

1. 서버에서 상태를 유지해야하기때문에 물리적으로 여러대의 서버에서 세션을 공유해야 하는 기술이 필요
2. 세션정보가 늘어나면 서버에 부담이 되는 문제
3. REST API는 stateless(무상태)를 지향함
4. 모바일웹,모바일앱에서도 같이 세션정보 공유하기 어려움.

### 토큰방식의 인증
JWT (Json Web Token)는 RFC에 정의된 표준으로 JSON형태로 인증데이터를 서버에서 만들고 이후에 클라이언트에서 보관함.
필요한 시점에 클라이언트는 토큰정보를 서버로 보내고 서버에서는 토큰정보를 받아서 인증이나 권한을 확인해서 처리함.

- 서버에서 토큰을 보관하지 않음. 
- 인증정보를 인코딩(해싱,서명방법이 포함된)해서 보관. (데이터 암호화가 된 건 아님)
- id정보 수준을 토큰 데이터에 보관하는 것이 안전.
- 토큰은 클라이언트 local storgage에 보관할 수 있음.
- 데이터의 노출방지는 https로 방어해야 함.
- 토큰은 유효기간 설정을 잘 만들어서 유효기간에 제한을 두어야 함.
- 세션을 대체해서 사용할 수도 있지만 개발자가 세션의 미묘한 상황에 대한 처리를 알아서 해주어야 함(로그아웃, 재요청, 세션유지시간 등)
- 세션과 함께 토큰을 접근 권한을 판단하는 용도로 사용하는 경우도 있음

### 인증
1. passport, possport-local module 다운로드 
```shell
npm install passport  passport-local express-session connect-flash --save-dev
```

2. module 추가. 
``` 
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy;
var session = require('express-session')
var flash=require("connect-flash");
```

3. /join 페이지 만들기.
/router/join/index.js 만들기.

```javascript
	router.get('/', function(req,res) {
		res.render('join.ejs')
	})
```

views/join.ejs 만들기.


4. middleware setting
```javascript
app.use(session({
 secret: 'keyboard cat',
 resave: false,
 saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
```


5. Strategy configuration
```javascript
passport.use('local-join', new LocalStrategy({
		usernameField : 'email',
	  passwordField : 'password',
	  passReqToCallback : true
	}, function(req, email, password, done) {
		console.log('local-join callback called', email, password);
		//applied escape
		var query = connection.query('select * from user where email=?', [email], function(err,rows) {

			if (err) return done(err);


			if (rows.length) {
					console.log("~~~~~~~ 1");
				  return done(null, false, { message: 'your email is already used' });
			} else {
					console.log("~~~~~~~ 2");
				var sql = {email : email, pw : password};
				var query = connection.query('insert into user set ?' , sql,  function(err,rows) {
					if(err) throw err
				  return done(null, {'email' : email, 'id':rows.insertId});
				});
			}
		})
	}
));
```

6. routing
passport authenticate메서드를 활용해서 'local-join' 이라는 strategy를 사용해서 redirect url을 처리.

```javascript
router.post('/',
  passport.authenticate('local-join', { successRedirect: '/main',
                                   failureRedirect: '/join',
                                   failureFlash: true })
);
```

7. 실패할 경우 프로세스 
done(null, false, { message: 'your email is already used' }) 에서 정의한 메시지를 포함해서,
failureRedirect: '/join' 여기서 정의한 대로 redirect처리 됨.
여기서 message 는 flash라고 해서 메시지 전달을 쉽게 도와줌. ('connect-flash' 모듈 설치 필요)

```javascript
	router.get('/', function(req,res) {
		var msg;
		var errMsg = req.flash('error');
		if(errMsg) msg = errMsg;
		//login ejs 를 만들어서 화면에 노출해야 함.
		res.render('join.ejs', {'message' : msg})
	})
```

8. 회원가입이 성공한 경우
```javascript
done(null, {'email' : email, 'id':rows.insertId})
```
해당정보를 입력하면 passport.serializeUser 메서드의 콜백함수 인자로 전달된다.
이후에 done메서드를 이용해서 필요한 값을 저장하면 그 값이 세션에 저장되게 된다. 여기서는 user.id 값을 세션에 저장하고 있다.

```javascript
passport.serializeUser(function(user, done) {
	console.log("serializeUser id is : " , user.id);
	done(null, user.id);
});
```

9. session 정보를 얻어오도록 설정.

저장된 세션이 있다면 그 정보를 모든 URL요청때마다 세션값을 확인하는 절차가 필요하다. 
세션정보를 모든 요청 앞단계에서 확인하고 요청 페이지로 전달해 준다면 이상적으로 동작한다고 볼 수 있다.
passport의 deserializeUser는 이것을 편리하게 돕는다.

passport.deserializeUser(function(id, done) {
	console.log("deserializeUser id is : " , id);
	connection.query("select * from user where uid = "+id,function(err,rows){	
		done(err, rows[0]);
	});
});
```










