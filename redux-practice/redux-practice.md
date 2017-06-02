
### 0. 준비. 라이브러리 추가.

CDN을 검색해서 다음의 4개 라이브러리를 추가해보자.
react, react-dom, redux, react-redux

시작코드 리뷰하기.
http://jsbin.com/cisoji/1/edit?js,output

이 코드를 jsbin에서 clone한다. (가급적 계정도 하나 만든다.)

---

### 1.준비 : 단계별로 코드 추가

action을 dispatch에 담아서 전달하고,
전달받은 action에 의해서 데이터 변경을 하기위해, reducer만들기.
 
 ---

### 2.이벤트 핸들러 함수 생성.
기존 addTodo 이벤트핸들러를 제거하고 아래처럼 변경.
Todo component 안에 다음과 같이 선언하고,
dispatch함수를 이용해서 실행하도록 함.


```javascript
  addTodo(evt) {
      store.dispatch({
        type: 'ADDTODO',
        todo : evt.target.previousSibling.value
      })            
  }
```
store객체를 못찾는 오류가 발생한다.

---

### 3.store를 사용하도록 하자.  
Redux 로 부터 store 생성을 위한 createStore메서드를 불러온다
```javascript
const { createStore } = Redux;
const store = createStore(todoReducer);
```
이번엔,  todoReducer is not defined..

---

### 4.reducer 를 만들자.
아래처럼 reducer에서 정의한 state가 서비스에서 활용하는 데이터 값이다.

```javascript
const todoReducer = (state = [], action) => {
  console.log(state, action);
  switch(action.type) {
    case 'ADDTODO':
      return [...state, action.todo];
    dafault: 
      return state;
  }
}
```

---

### 5. 변경된 store정보 받기.
store객체에는 subscribe와 getState메서드가 있다.

subscribe를 통해서 뷰 컴포넌트를 다시 렌더링하도록 등록하고, 
getState를 통해서 정보를 받아서 컴포넌트에 넣어주자.

---

### 6.subscribe에 render 함수 등록.
```javascript
const render = () => {
  ReactDOM.render(
    <TodoApp />, document.querySelector("#wrap")
  );
};

//store가 변경되면 view component를 다시 렌더링하도록 등록.
store.subscribe(render);

//rendering 처음 실시
render();
```
---

### 7.getState()를 통해서 컴포넌트에 데이터 주입.
지금까지 하면 변경된 데이터를 필요한 컴포넌트에서 가져와야 한다.
store객체의 getState()메서드를 통해서 가져올 수 있다
.
```javascript
const render = () => {
  ReactDOM.render(
    <TodoApp data={store.getState()} />, document.querySelector("#wrap")
  );
};
```
---

### 8.props를 통해서 컴포넌트에서 데이터에 따른 뷰처리.
props로 필요한 데이터를 받아서 처리하도록 Component를 수정.
```javascript
  render() {
    let {data, addTodo} = this.props;
    
    return (
      <div>
        <div>
         <input type="text" placeholder="할일입력" />
         <button onClick={this.addTodo.bind(this)}> 추가 </button>
        </div>
        <div>
          <ListView data={data} />
        </div>
      </div>
    )
  }
```

---

### 9.완성코드 리뷰하기

---

### 10.store 의 변경을 컴포넌트에 반영하는 것 개선.
컴포넌트가 중첩되고 복잡해지면, getState와 subscribe를 사용하는 것이 복잡해진다.
react-redux 를 통해 이를 개선해보자.

---

### 11.connect 함수를 통해서 store를 사용을 추상화하기.
store의 값들을 접근하기 위해서 getState메서드를 사용하지 않고, UI component에서 Props 속성으로 접근할 수 있다.

다시말해, UI Component안에서 subscribe()를 해서 store에 구독을 요청하고, 
getState()메서드의 값을 이용해서 다시 렌더링을 하도록 하는 코드를 Component안에서 구현해야 할 것이다.

하지만 모델의 변화를 탐지해야 하는 컴포넌트들에서 매번 그렇게 작업하는 것은 어렵고 지저분한 코드를 만들게 된다.

connect 메서드를 통해서 이 작업을 쉽게 할 수 있다. 
다시말해 connect 메서드는 store관련 역할을 주로 한다.
실제로 connect는 store값을 쉽게 얻은 후 컴포넌트에 전달해주는 역할과, dispatch 작업을 해주는 역할을 담고 있다.

store값을 쉽게 구독해서 값을 받아서 하위 컴포넌트에 전달할 수 있게, mapStateToProps라는 함수를 정의하면 되고,
store.dispatch 메서드를 하위컴포넌트밖에서 정의해서 사용할 수 있도록 mapDispatchToProps 함수를 사용한다.

---
### 12. subscripb, getState코드제거.
subscribe와 getState를 직접하지 않고, 대신 store객체를 컴포넌트에 전달해준다.
```javascript
/* ROOT Component TodoApp */

const TodoApp = (props) => {
  return (
      <div>
        <Header />
        <Todo store={props.store}/>
      </div>
    )
}

const render = () => {
  ReactDOM.render(
    <TodoApp store={store} />,
   document.querySelector("#wrap")
  );
};

//store가 변경되면 view component를 다시 렌더링하도록 등록.
//store.subscribe(render);

//rendering 처음 실시
render();

```

### 13. connect에 필요한 mapStateToProps 함수 구현.
TodoContainer를 새롭게 만들고, state값을 props형태로 Todo에 추가해주는 작업을 해준다.
mapStateToProps 메서드는 props에 상태값(store에 저장된 값)을 매핑한다라고 이해하면 쉽다.

```javascript
const {connect} = ReactRedux;

const mapStateToProps = (state) => {
  return {
    data: state
  };
}

//connect 메서드의 첫번째 인자로 mapStateToProps 를 추가.
//이제 Todo앱에서는 store를 props로 쉽게 전달받아 사용할 수 있다.
const TodoContainer = connect(
  mapStateToProps
)(Todo);

//render부분에서는 Todo가 아닌 TodoContainer를 렌더링하게 설정.
const TodoApp = (props) => {
  return (
      <div>
        <Header />
        <TodoContainer store={props.store}/>
      </div>
    )
}

```

---

### 14. Todo 컴포넌트에서의 data 접근확인.
Todo 앱에서는 data를 잘 전달받아서 수정없이 그대로 사용가능.

---

### 15.dispatch 부분 분리하기.
컴포넌트에 존재하고 있는 아래 코드를(action을 실행하는) 컴포넌트 밖으로 분리해보자.
```javascript
  addTodo(evt) {
      store.dispatch({
        type: 'ADDTODO',
        todo : evt.target.previousSibling.value
      })            
  }
```
---

### 16.dispatch 분리하기.
dispatch로 store객체를 통해서 사용해야 하는데, UI Component에서 store객체를 직접받아서 쓰지 말고, 
상위에서 처리하도록 하기 위해 분리한다. UI Component 에서는 store의 의존성도 없어진다.
connect메서드를 활용해서 store의 state값을 UI Component에서 쉽게 전달받았듯이 dispatch도 비슷하게 처리할 수 있다.

```javascript
const mapDispatchToProps = (dispatch) => {
  return {
    addTodo(evt) {
      dispatch({
        type: 'ADDTODO',
        todo : evt.target.previousSibling.value
      })            
    }
  }
}

```

---

### 17.dispatch 분리하기.
connect 함수의 두번째 인자로 mapDispatchToProps함수를 추가한다.
```javascript
const TodoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Todo);
```

---

### 18.컴포넌트에서 addTodo 이벤트 핸들러를 삭제.
props 를 통해서 이벤트 핸들러를 받을 수 있으니, 다음과 같이 props로부터 addTodo를 받아서 처리.

```javascript
render() {
  let {data, addTodo} = this.props;
  ...
```

--- 
### 19.Action 함수를 별도로 분리.
Action부분을 분리해서 따로 함수로 만들자.
이렇게 되면 dispatch안에 있던 코드가 별도로 분리된다.
많은 action을 이렇게 몰아서 별도의 소스파일로 관리하면 좋다.

```javascript
const addTodo = (todo) => ({
   type: 'ADDTODO',
   todo : todo
})
```

mapDispatchToProps 부분은 아래처럼 변경.
```javascript
const mapDispatchToProps = (dispatch) => {
  return {
    addTodo(evt) {
      dispatch(addTodo(evt.target.previousSibling.value))
     }          
  }
}
```
---

### 20. 지금까지 코드 리뷰.
http://jsbin.com/vebixez/1/edit?js,output

---
### 참고. shorthand mapDispatchToProps
mapDispatchToProps 코드를 삭제하고, action을 바로 불러서 사용할 수 있다. 
이로인해 불필요해보일 수 있는 dispatch메서드 실행을 생략할 수 있다.

대신 UI Component에서 이벤트 핸들로 코드를 추가해야 한다.

http://jsbin.com/matizig/1/edit?js,output

---

### 21. store 전달하는 거 지워버리기.
아직까지 store를 전달하기 위해서 이러고 있다. 

```javascript
const TodoApp = ({store}) => {
  return (
    <div>
      <Header store={store} />
      <TodoContainer store={store} />
    </div>
  )
}
```
사실 정상적인 코드임에도 react-redux는 이를 개선하는 방법을 제공한다.
react-redux는 connect이외에 Provider라는 것을 제공해서 하위 컴포넌트에서 store를 쉽게 사용할 수 있게 해준다.
(react-redux내부에서 react가 제공하는  [Context](https://facebook.github.io/react/docs/context.html#how-to-use-context)라는 기술을 사용한다. )

### 22. react-redux의 Provider 사용하기.
ReactRedux로부터 Provider 컴포넌트를 로드하고, 
Root component를 Provider로 감싼다.
그리고 계속 하위 컴포넌트로 전달했던 store속성을 제거한다.

```javascript
const {connect, Provider} = ReactRedux;

/* ROOT Component TodoApp */
const TodoApp = () => {
  return (
      <div>
        <Header />
        <TodoContainer />
      </div>
    )
}

const render = () => {
  ReactDOM.render(
    <Provider store={store}>
      <TodoApp />
    </Provider>,
   document.querySelector("#wrap")
  );
};


```
http://jsbin.com/qaqivu/1/edit?js,output

### 추가기능도전 : 삭제관련 클릭이벤트 등록

먼저 addTodo와 비슷한 기능인 deleteTodo 만들어보기.

최종 : http://jsbin.com/volerab/1/edit?js,output
