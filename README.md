## 기록

### 8/22
- 검색 키워드, 검색 결과 모두 behaviorSubject로 만들고 state에 넣어 관리함
- 검색 결과는 일단 JSON stringify해서 출력해놓음

TODO
- [ ] 결과 데이터 타입 정의
- [ ] 화면 새로고침시 keyword$ 초기화
- [ ] service 파일 분리

WISH TODO.. 🥲
- [ ] debounce 추가
- [ ] switchMap으로 변경 (결과 받아오는 도중 키워드 바뀔 경우 처리)
- [ ] useEffect, useState 조합이 아닌 방법으로 subject에서 값 뽑아오는 법 찾기
