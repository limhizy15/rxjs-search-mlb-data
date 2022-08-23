## 기록

### 8/22
- 검색 키워드, 검색 결과 모두 behaviorSubject로 만들고 state에 넣어 관리함
- 검색 결과는 일단 JSON stringify해서 출력해놓음

TODO
- [x] 결과 데이터 타입 정의
- [ ] 화면 새로고침시 keyword$ 초기화
- [ ] service 파일 분리

WISH TODO.. 🥲
- [x] debounce 추가
- [x] switchMap으로 변경 (결과 받아오는 도중 키워드 바뀔 경우 처리)
- [x] useEffect, useState 조합이 아닌 방법으로 subject에서 값 뽑아오는 법 찾기

### 8/23
- 결과 UI 정리
- 검색 최적화
    - debounce 추가
    - 검색 과정 모두 operator로 처리하도록 변경
- 플레이어 이름 누르면 상세 조회 기능 추가
    - react router 추가
    - 상세화면 진입 후, api 호출해서 렌더링하도록함

**NOTE**
- [pluck](https://rxjs.dev/api/operators/pluck)
    - Deprecated된 operator..
    - `pluck('v') = map(x => x.v)`
- [mergeMap](https://www.learnrxjs.io/learn-rxjs/operators/transformation/mergemap)
    - switchMap은 source가 발행되면 내부 subscription이 complete되어 활성화된 내부 subs는 1개가 되도록 한다. 반면 mergeMapdms 내부 subs가 여러개일 수 있다.
    - 따라서, mergeMap은 취소되어서 안되는 요청을 다룰 때 사용한다. 
    - memory leak을 신경써야한다.
    - 굳이 검색에서 사용할 이유가 없어보인다.
- Q. tap해서 keyword 넘기고 api 호출하는거랑 mergeMap해서 호출하는거랑 큰 차이가 없어보인다. switchMap은 메리트가 있는데..
    - switchMap은 pipe 취소함! keyword 바뀌면~
- [retry](https://www.learnrxjs.io/learn-rxjs/operators/error_handling/retry)
    - error나면 api 재시도@
- [distinctUntilChanged](https://www.learnrxjs.io/learn-rxjs/operators/filtering/distinctuntilchanged)
    - 입력 stream에서 값이 바뀔 때만 operator 수행
    - 근데 검색할 때 어차피 타이핑될 때만 호출되지 않나? (a -> ab -> abc 등 변경이 발생할 때만이니까..) 하나 지웠다가 똑같은거 입력하는 거 때문? (a => ab => a)
- [useObservableState](https://observable-hooks.js.org/api/#useobservablestate)
    - [내부 코드](https://github.com/crimx/observable-hooks/blob/master/packages/observable-hooks/src/use-observable-state.ts)
    - Observable로부터 현재 값을 가져온다.
    - 내부코드에서는 observable을 subscribe하면서 값이 바뀌면 useState로 정의한 state에 값을 쏴주는 것