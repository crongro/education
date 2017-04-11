
### 0. 준비. 라이브러리 추가.

CDN을 통해서 다음의 4개 라이브러리를 추가해보자.
react, react-dom, redux, react-redux

---

### 1.클릭이벤트 등록
 ```javascript
onClick={addTodo}
 ```

 ---

### 2.이벤트핸들러 함수 생성.
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
store 객체를 못찾는 오류가 발생한다.

---

### 3.store 를 사용하도록 하자.  
Redux 로 부터 store 생성을 위한 createStore메서드를 불러온다
```javascript
const { createStore } = Redux;
const store = createStore(todoReducer);
```
이번엔,  todoReducer is not defined..

---

### 4.reducer 를 만들자.
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
  console.log("render called");
  ReactDOM.render(
    <Todo />, document.querySelector("#wrap")
  );
};

//store가 변경되면 view component를 다시 렌더링하도록 등록.
store.subscribe(render);

//rendering 처음 실시
render();
```
---

### 7.getState()를 통해서 컴포넌트에 데이터 주입.
```javascript
const render = () => {
  console.log("render called");
  ReactDOM.render(
    <Todo data={store.getState()} />, document.querySelector("#wrap")
  );
};
```
---

### 8.props를 통해서 컴포넌트에서 데이터에 따른 뷰처리.
```javascript
  render() {
    let data = this.props.data;
    let listHTML = "";
    
    if(typeof data !== "undefined") {
      listHTML = data.map((v,i) => {
        return <li key={i}>{v}</li>
      });
    }
    
    return (
      <div>
        <div>
         <input type="text" placeholder="할일입력" />
         <button onClick={this.addTodo}> 추가 </button>
        </div>
        <div>
          {listHTML}
        </div>
      </div>
    )
  }
}
```

---

### 9.완성코드 리뷰하기

---

### 10.store 의 변경을 컴포넌트에 반영하는 것 개선.
컴포넌트가 중첩되고 복잡해지면, getState와 subscribe를 사용하는 것이 복잡해진다.
react-redux 를 통해 이를 개선해보자.

---

### 11.connect 함수를 통해서 store의 state 값을 전달받기.
store의 값들을 접근하기 위해서 getState메서드를 사용하지 않고, UI component에서 Props 속성으로 접근할 수 있다.

mapStateToProps 메서드는 props에 상태값을 매핑한다라고 이해하면 쉽다.

```javascript
const mapStateToProps = (state) => {
  return {
    data: state
  };
}

const {connect} = ReactRedux;
const TodoContainer = connect(
  mapStateToProps
)(Todo);
```

---

### 12.TodoContainer 를 렌더링하도록 설정.
render부분에서는 Todo가 아닌 TodoContainer를 렌더링하게 설정한다.
이때 store속성을 넣어줘야만 한다. 그래야 TodoContainer가 store객체를 이용해서 state값을 추출해서 Todo에 전달해줄 수 있게 된다.

```javascript
ReactDOM.render(
 <TodoContainer store={store} />, 
 document.querySelector("#wrap")
);
```

---

### 13.component에서 약간 수정.
subscribe나 getState를 쓰지 않았음에도 불구하고,
props로 간단하게 데이터(스토어)에 접근할 수 있다.

```javascript
  render() {
    let {data} = this.props;
    let listHTML = "";
    
    if(typeof data !== "undefined") {
      listHTML = data.map((v,i) => {
        return <li key={i}>{v}</li>
      });
    }
```

---

### 14.dispatch 부분을 분리하기.
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

### 15.dispatch 분리하기.
아래코드를 추가한다.
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

### 16.dispatch 분리하기.
connect 함수의 두번째 인자로 mapDispatchToProps함수를 추가한다.
```javascript
const TodoContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(Todo);
```

---

### 17.컴포넌트에서 addTodo 이벤트 핸들러를 삭제.
props 를 통해서 이벤트 핸들러를 받을 수 있으니, 다음과 같이 처리.

```javascript
render() {
  let {data, addTodo} = this.props;
  let listHTML = "";
  ...
```

---

### 18.실습 : 자식컴포넌트 생성.
li를 보여주는 부분을 자식 컴포넌트로 새롭게 만들어서 구성한다.

---

### 19.실습 : 리스트를 선택해서 삭제하는 기능을 만들어보세요.


