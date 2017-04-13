### 1.프로젝트 준비
front-end 프로젝트는 framework를 쓰기 시작하면서 복잡하다.
특히 빌드해야 할 것들이 늘어나면서 환경구성과 프로젝트 디렉토리 구조를 정리하는 것이 어려움.
boilerplate 라고 기본환경을 제공해주는 오픈소스가 꽤 있음.

http://andrewhfarmer.com/starter-project/

---

### 2. React 기반 기본환경 만들기.
React Creact App써보자.
https://github.com/facebookincubator/create-react-app

---

### 3. start
시키는 대로 하자.

```shell
sudo npm install -g create-react-app
create-react-app my-app
cd my-app/
npm start
```

```shell
//for production build
npm run build.
```

---

### 4. http://localhost:3000/
크롬개발자도구로 index.html 소스코드 보기.
-> bundle.js 코드가 주입되어 있음.

---

### 5. 코드리딩

index.js

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';

ReactDOM.render(
  <App />,
  document.getElementById('root')
);
```
App.js 도 보기.
 
---

### 6. 수정
App.js 살짝 수정해보기.

App.css 도 살짝 수정해보기.

App.* 파일들 src/Component 디렉토리로 옮겨보기.

---

### 7. Header를 분리해보기. 
새롭게 Header 컴포넌트를 만들어보자.
새롭게 Content 컴포넌트를 만들어보자.

---

### 8. React 개발자 도구 설치.
크롬개발자도구에 확장판 설치하기.

---

### 9. redux, react-redux 설치.
```shell
npm install redux react-redux --save-dev
```
---

### 10. redux 연동해보기.
먼저, 지난번 redux 코드 리뷰.

http://jsbin.com/joyojej/1/edit?html,js,output

위 코드를 기반으로 구현해보기.

---

### 11. App.js 에 store추가해보기.
App.js 에 store 관련된 내용부터 추가해보자.
import 방식으로 모듈을 불러올 수 있다.
```javascript
import {connect, Provider} from 'react-redux';
import { createStore } from 'redux';

const store = createStore();
```

---

### 12. reducer 만들기.
당연하게도 reducer가 있어야 store를 쓸 수가 있다.
기획은 간단히 화면에 자신이 좋아하는 게임리스트를 보여준다고 가정하고 화면을 구성한다.

- reducer는 그저 함수다. 
- initialState를 만들어서 활용할 수 있다.
- 역시 모듈임으로 export 를 해줘야 한다.

```javascript
let initialState = {
  title : "My GameList",
  gamelist : []
};

const contentReducer = (state = initialState, action) => {
   
  switch(action.type) {
    case 'ADD_GAME':
      return {...state, gamelist : [...state.gamelist, action.value]};
    default: 
      return state;
  }
}

export default contentReducer;
```

---

### 13. store 전달하기 위한 Provider등록
```javascript
return (
  <Provider store={store}>
    <div className="App">
      <Header />
      <Content />
    </div>
  </Provider>
);	
```

---

### 14.redux의 store정보가 필요한 컴포넌트에 connect 로 연결지어주기.
mapStateToProps, mapDispatchToProps 를 설정하지 않고 
우선 connect연결만해보자.

```javascript
...
import { createStore } from 'redux';
const store = createStore(contentReducer);

//이렇게!
const ContentContainer = connect()(Content);

...

<Provider store={store}>
  <div className="App">
    <Header />
    <ContentContainer/>
  </div>
</Provider>
```
이렇게 연결만해도 dispatch 함수를 전달해서 UI Component에서 사용할 수가 있다.

---

### 15. dispatch의 사용.
Provider와 connect덕분에 잘 전달받은 dispatch함수를 UI Component에서 사용할 수 있다.
```javascript
//Component/Content.js
class  Content extends Component {
  render() {
  	const {dispatch} = this.props;
    return (
      <div>
      	<p> My content is null...-_- </p>
      </div>
    );
  }
}
```

---

### 16. 버튼 하나 만들고 onClick 핸들러 만들기.
핸들러 완성 이후에, dispatch적용하기.

잘되는지 확인하려면 reducer에서 action을 출력해보자.

---

### 17. store의 state를 받아보자.
mapStateToProps를 통해서 컴포넌트에 state값을 전달해보자.

```javascript
const mapStateToProps = (state) => {
  return state;
}
```

UI Component에서는 이렇게 props로 전달받아서 사용가능하다.
```javascript
let {title, gamelist} = this.props;
let gamelistJSX = gamelist.map((value, i) => {
  return <li key={i}> {value} </li>
});
```

---

### 18. 어떤 부분이 리팩토링이 필요할까? 
AppUIRoot 를 새로 만들고 App.js를 좀 깨끗이 정리하자. 
```
class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppUIRoot />
      </Provider>
    );
  }
}
```

---

### 19. dispatch를 UI Component에서 분리하자.
AppUIRoot.js로 옮기고, 
Component/Content.js 는 정리하고.

그리고,
Content.js를 functional component로 바꿔서 간단하게 렌더링 되도록하자.
이렇게 하면 component 의 life cycle을 생략할 수 있다.

---

### 20 ..
[.](https://github.com/nigayo/_cra_base_small_step)

