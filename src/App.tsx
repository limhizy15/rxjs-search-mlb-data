import React, {useEffect, useMemo} from 'react';
import * as rxjs from 'rxjs';
import axios from 'axios';
import _ from 'lodash';
import { useObservable, useObservableState } from 'observable-hooks';
import { Link } from 'react-router-dom';
import { API_URL, PlayerType } from './utils';

function App() {
  return (
    <div>
      <SearchPage />
    </div>
  )
}

function SearchPage() {
  // subject는 진짜 최초인 것으로 최소한만 사용하도록
  const keyword$ = new rxjs.BehaviorSubject('');

  const onChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    keyword$.next(event.target.value)
  }

  // 새로운 파이프라인을 만들고 메모이징한다
  const result$ = useMemo(() => keyword$.pipe(
    rxjs.debounceTime(200),
    rxjs.distinctUntilChanged(),
    rxjs.switchMap(keyword => 
      rxjs.from(axios.get(`${API_URL}/json/named.search_player_all.bam?sport_code='mlb'&active_sw='Y'&name_part='${keyword}%25'`)).pipe(
        rxjs.map(result => {
          return (result.data.search_player_all.queryResults.row)
        }),
        rxjs.retry(2),
        rxjs.catchError(err => rxjs.of(err))
      )
    )
  ), []);

  return (
    <div className="App">
      <h1>MLB Data</h1>
      <input 
        id={'keyword'} 
        type={'text'} 
        onChange={onChangeKeyword} 
        placeholder={'이름을 입력해보세요 💡'}
      />
      <ResultPage result$={result$} />
    </div>
  );
}

function ResultPage({
  result$
}: {
  result$: rxjs.Observable<PlayerType[]>;
}) {
  // useObservableState은 콜백도 받는다!! 스트림 넘기면 내가 알아서 할게
  const result = useObservableState(result$, [])

  if (result == null) {
    return (
      <div>
        <p>검색 결과가 없어요 🔦</p>
      </div>
    )
  }
  return (
    <div>
      {
        _.uniqBy(result, 'name_display_first_last').map(v => {
          return (
            <div key={v.name_display_first_last}>
              <Link to={`/players/${v.player_id}`}>
                <h4>{v.name_display_first_last} ({v.position})</h4>
              </Link>
              <p>TEAM - {v.team_full}</p>
              <p>COUNTRY - {v.birth_country}</p>
            </div>
          )
        })
      }
    </div>
  )
}

export default App;
