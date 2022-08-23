import React, {useEffect} from 'react';
import * as rxjs from 'rxjs';
import axios from 'axios';
import _ from 'lodash';
import { useObservableState } from 'observable-hooks';
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
  const keyword$ = new rxjs.BehaviorSubject('');
  const result$ = new rxjs.BehaviorSubject<PlayerType[]>([]);

  const onChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    keyword$.next(event.target.value)
  }

  // TODO: 페이지 새로고침되면 keyword null string으로 변환되게
  // useEffect(() => {
  //   keyword$.next('')
  // }, [])

  useEffect(() => {
    const subs = keyword$.pipe(
      rxjs.debounceTime(200),
      rxjs.distinctUntilChanged(),
      rxjs.switchMap(keyword => 
        rxjs.from(axios.get(`${API_URL}/json/named.search_player_all.bam?sport_code='mlb'&active_sw='Y'&name_part='${keyword}%25'`)).pipe(
          rxjs.map(result => {
            result$.next(result.data.search_player_all.queryResults.row)
          }),
          rxjs.retry(2),
          rxjs.catchError(err => rxjs.of(err))
        )
      )
    ).subscribe();

    return () => subs.unsubscribe();
  }, [])

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
