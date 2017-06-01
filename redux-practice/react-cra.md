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
가이드에서 시키는대로 해보자.

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
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
```
App.js 도 보기.
 
---

### 6. 수정
App.js 살짝 수정해보기.

App.css 도 살짝 수정해보기.

App.* 파일들 src/Component 디렉토리로 옮겨보기.

---

### 9. redux, react-redux 설치.
```shell
npm install redux react-redux --save-dev
```
---

### 10. redux 연동해보기.
먼저, 지난번 redux 코드 리뷰.

http://jsbin.com/wavohes/1/edit?js,output

위 코드를 기반으로 구현해보기.

---
### index.js 에 초기코드 추가.

store생성과 Provider 관련 모듈 import

```javascript
import { Provider } from 'react-redux'
import { createStore } from 'redux';
import todoReducer from './reducer/index';
const store = createStore(todoReducer);


const render = () =>  ReactDOM.render(
  //....
);

render();
```

--- 
### 모듈(컴포넌트)단위로 파일 나누기.
외부에서 ListView 를 사용할 수 있도록 export default를 사용.

//1. ListView.JS

```javascript
//functional component구조에서도 React import가 필요함.
import React from 'react';
const ListView = ({data, onClick}) => {
     .....
    return (<ul>{listHTML}</ul>)
}
export default ListView;
```

//2. TodoContainer.js.
//위에서 export한 모듈(컴포넌트)를 이렇게 추가해서 사용할 수 있다.
```javascript
import ListView from './component/ListView';
```

---
### 나머지 컴포넌트도 옮겨서 구현하기
- reducer 구현
- App.js에 하위 컴포넌트(Header, TodoContainer) 추가
- 나머지 필요한 ListView컴포넌트도 추가

---
### 디렉토리 구성
비슷한 역할을 하는 녀석들을 그룹지어 구성한다. 하지만 상황에 따라 서비스별로 몰아둘 수도 있음.
src/components/ListView.js
src/components/Header.js
src/reducer/todo.js
src/actions/todo.js
각 컴포넌트에 테스트코드를 같이 위치시키는 것을 권장.

---
### 기능추가하기
삭제한 task를 이제는 완료한 일로 묶어서 관리해두기.
- deleteTodo 표현을 completeTodo로 변경하기.
- todolist만 존재하는 데이터(state)에 '완료한일'도 추가하기 -> reducer에서 변경.
  initialState를 만들고 새로운 store형태로 변경하기 
- completeList라는 새로운 listview 하나를 만든다 (ListView와 유사하게 구현)

---
### 비동기로직 : 화면 로딩 때 Back-end에서 todolist와 completelist를 가져오기
전략 : componentDidMount 타이밍에 Ajax요청을 보내서 데이터를 받아오자.

---
### fake API
fakeDB/fakeInitData.js 파일에 아래 내용을 추가해서 가상의 백엔드 API하나 만들기
```javascript
const initDataSet = () => (
  {
    'todos' : ['React study', 'play game', 'clean my room'],
    'completeList' : ['meeting']
  }
)
export const fakeInitData = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(initDataSet());
    }, 800);
  });
}
```

---
### fake API를 호출해서 초기데이터 가져오기
```javascript
  componentDidMount() {
    fakeInitData().then( initData => {
      console.log(initData);
    });
  }
```

---
### action에 해당하는 코드 추가. 그리고 관련 reducer부분 추가.
mapDispatchToProps 부분에 추가한다.
```javascript
  setInitData(initData) {
      dispatch({
        ...
      })
    }
```

componentDidMount에서 이제 then 콜백안에서 setInitData를 호출하도록 수정.
이후에 reducer에서 데이터 변경작업 추가.

---
### action을 별도 파일로 분리해보자
src/action/index.js 를 생성하고 action부분을 다음처럼 구현
```javascript
import {fakeInitData} from '../fakeDB/fakeInitData';

export const addTodo = (evt) => (
    {
        type: 'ADDTODO',
        todo : evt.target.previousSibling.value
    } 
)

export const completeTodo = (evt) => (
    {
        type: 'COMPLETE_TODO',
        todo : evt.target.textContent
    }
)
```

---
###  mapDispatchToProps 에서 action코드를 호출하는 것으로 수정.

```javascript
const mapDispatchToProps = (dispatch) => {
  return {
    addTodo(evt) {
        dispatch(actions.addTodo(evt))
    },
    completeTodo(evt) {
        dispatch(actions.completeTodo(evt)) 
    }
  }
}
```

---
### async action은 어떻게 처리해야 할까? 
dispatch를 실행시키기 위해서는 객체형태의 결과를 담아줘야 한다. 
action에서 async처리를 하기 위해서는 어떠한 객체형태를 반환해야 한다.

이런식으로 처리해야 한다.
```javascript
    ...
    getInitData() {
      dispatch(actions.getInitData(dispatch))
    }
    ...
```
getInitData는 비동기로 동작한다. 그리고 동작 이후에 그 결과를 reducer에 전달하기 위해 또 다른 dispatch를 실행해야 한다. 
이처럼 getInitData는 다른 액션과 달리 객체를 반환할 수 없다.
또한 처리 결과에 따라서 새로운 action 메서드를 실행해줘야 한다.
이처럼 비동기 로직의 action처리는 다른것과 다른처리가 필요로 한다.

redux-thunk 와 같은 모듈을 이용해서 비동기 처리를 돕는 것을 사용해야 한다.
https://github.com/gaearon/redux-thunk

---
### redux-thunk로 async 처리하기
redux-thunk라는 모듈을 사용해서 비동기 처리를 하면, action코드를 다음과 같이 작성할 수 있고, 
redux구조에서도 비동기 처리를 자연스럽게 구현할 수 있다. 

```
//action.js
export const getInitData = (dispatch) => {
    //redux-thunk 를 사용하기 때문에 함수로 작성하고 이를 반환한다.
  return (dispatch) => { 
        fakeInitData().then( (initData) => {
          //후속 action처리를 할 수 있다.
          dispatch(setInitData(initData));
        });
  };
}

//TodoContainer.js mapDispatchToProps에서 실행하는 dispatch실행은 다른 것과 유사하다.
  getInitData() {
    dispatch(actions.getInitData(dispatch))
  }
```

---
###  mapDispatchToProps 전체코드. 

```javascript
const mapDispatchToProps = (dispatch) => {
  return {
    addTodo(evt) {
        dispatch(actions.addTodo(evt))
    },
    completeTodo(evt) {
        dispatch(actions.completeTodo(evt)) 
    },
    getInitData() {
      dispatch(actions.getInitData(dispatch))
    }
  }
}
```

---
### 더 고민할 것들..
- 초기 로딩시에 loading... 메시지를 표현하는 방법은 무엇일까? 
- redux-router 를 사용한 navigation 기능 추가
- 인증, SPA에서는 jwt와 같은 토큰기반 인증방식과 어울림. 특정 API호출시에만 인증과정을 거치도록 구현.

---
### 8. React 개발자 도구 설치
디버깅을 위해서 크롬개발자도구에 확장판 설치하기.
