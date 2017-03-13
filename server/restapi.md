## REST
REpresentational State Transfer
> REST is an architecture style for designing networked applications.  (wiki)

표면적인 실체는 '스타일' 또는 '패턴'이라고 할 수 있다.

---

## RESTful API
REST한 방식의 API라는 건, 아래처럼 잘 설계된 API를 말한다.
- 웹을 근간으로 하는 HTTP Protocol기반이다.
- 리소스(자원)는 URI(Uniform Resource Identifiers)로 표현하며 말 그대로 '고유'해야 한다.
- URI는 단순하고 직관적인 구조이어야 한다.
- 리소스의 상태는 HTTP Methods를 활용해서 구분한다.
- xml/json을 활용해서 데이터를 전송한다. (주로 json)

---

## CRUD
네트웍을 통해 웹 리소스(resource)를 다루기 위한 행위들.
각각의 행위를 처리 하기 위한 HTTP methods(POST,GET,PUT,DELETE)가 있음.
- Create (POST)
- Retrieve (GET)
- Update (PUT)
- Delete (DELETE)

---

## API Design
- 복수명사를 사용 ( /movies )
- 필요하면 URL에 하위 자원을 표현. ( /movies/23 )
- 필터조건을 하용할 수 있음 ( /movies?state=active )

---

## Example

| URL        |     Methods       | 설명  |
| ------------- |:-------------:| :-----:|
| /movies/      |  GET |모든 영화리스트 가져오기 |
| /movies/      |  POST |영화 추가 |
| /movies/:title      | GET | title 해당 영화 가져오기 |
| /movies/:title     |  DELETE |title 해당 영화 삭제 |
| /movies/:title     |  PUT |title 해당 영화 업데이트 |
| /movies?min=9  | GET |상영중인 영화리스트 |



