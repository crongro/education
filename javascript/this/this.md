## 1. this

javascript의 this는 '실행순간'에 결정됨.
그때그때 달라서 이를 외워서 처리하기 어렵다.


## 2. function 

```javascript
    function code() {
    	return this;
    }
    code() //window
```

## 3. function - constructor

```javascript
    function code() {
    	return this;
    }
    new code() //object (code)
```


## 4. object literal 

```javascript
    var obj = {
    	code : function() {
        	return this;
        }
    }
    var myobj = obj.code() //object (obj)
    
```


## 5. async 
this가 헷갈리는 큰 이유는 async 로직때문이다.

```javascript
    var obj = {
    	code : function() {
        	setTimeout(function() {
            	console.log(this);
            },10);
        }
    }
   obj.code() //window
```


## 6. debugging

debugger로 그때그때의 this를 확인하는 것이 this를 이해하고 문제를 해결하는 좋은 방법이다.


## 7. bind

this를 내가 원하는 것으로 변경해주는 녀석.
이코드는 무엇이 문제인가?

```javascript
    var obj = {
    	code : function() {
            this.code = "javascript";
        	setTimeout(function() {
            	this.printCode();
            },10);
        },
        printCode : function() {
            console.log("code is ", this.code);
        }
    }
   obj.code()
```

**#bind 메서드를 활용해 해결가능.**

```javascript
    var obj = {
    	code : function() {
            this.code = "javascript";
        	setTimeout(function() {
            	this.printCode();
            }.bind(this),10);
        },
        printCode : function() {
            console.log("code is ", this.code);
        }
    }
   obj.code()
```

