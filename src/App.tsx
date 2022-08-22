import React, {useState, useEffect} from 'react';
import * as rxjs from 'rxjs';
import axios from 'axios';

const url = 'https://lookup-service-prod.mlb.com/json/named.search_player_all.bam';

type PlayerType = {
  // TODO: 데이터 타입 정의
  created: Date;
  totalSize: number;
  row: {
    position: string;
  }
}

type ResultType = {
  'search_player_all': {
    copyRight: string;
    queryResults: PlayerType;
  }
}

function App() {
  const keyword$ = new rxjs.BehaviorSubject('');
  const result$ = new rxjs.BehaviorSubject<ResultType>({} as ResultType);

  const onChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    keyword$.next(event.target.value)
  }

  // TODO: 페이지 새로고침되면 keyword null string으로 변환되게
  // useEffect(() => {
  //   keyword$.next('')
  // }, [])

  useEffect(() => {
    const subs = keyword$.pipe(
      rxjs.tap(v => {
        if (v == '' || v == null) {
          return;
        }

        // TODO: Url 정리
        axios.get(`${url}?sport_code='mlb'&active_sw='Y'&name_part='${v}%25'`)
        .then((result) => {
          const data = result.data as ResultType;
          result$.next(data);
        })
        .catch(err => console.log(err))
      })
    ).subscribe();

    return () => subs.unsubscribe();
  }, [])

  return (
    <div className="App">
      <h1>Hi</h1>
      <input id={'keyword'} type={'text'} onChange={onChangeKeyword} />

      <div>
        {/* subject인데 getValue가 왜 안되지 */}
        <p>입력: {keyword$.getValue()}</p>
      </div>
      
      <ResultPage result$={result$} />
    </div>
  );
}

function ResultPage({
  result$
}: {
  result$: rxjs.Observable<ResultType>;
}) {
  const [res, setRes] = useState({} as ResultType);

  // 정녕 useEffecf를 써야하나
  useEffect(() => {
    result$.subscribe(v => setRes(v))
  }, [])

  return (
    <div>
      {JSON.stringify(res)}
    </div>
  )
}

export default App;
