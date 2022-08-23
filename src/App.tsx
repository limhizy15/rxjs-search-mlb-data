import React, {useEffect} from 'react';
import * as rxjs from 'rxjs';
import axios from 'axios';
import _ from 'lodash';
import { useObservableState } from 'observable-hooks';

const url = 'https://lookup-service-prod.mlb.com/json/named.search_player_all.bam';

type PlayerType = {
  'position': string;
  'birth_country': string;
  'name_display_first_last': string;
  'college': string;
  'name_display_roster': string;
  'bats': string;
  'team_full': string;
  'team_abbrev': string;
  'birth_date': string;
  'throws': string;
  'name_display_last_first': string;
  'player_id': string;
  'team_id': string;
}

type ResultType = {
  created: Date;
  totalSize: number;
  row: PlayerType;
}

function App() {
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
        rxjs.from(axios.get(`${url}?sport_code='mlb'&active_sw='Y'&name_part='${keyword}%25'`)).pipe(
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
              <h4>{v.name_display_first_last} ({v.position})</h4>
              <p>TEAM - {v.team_full}</p>
              <p>COUNTRY - {v.birth_country}</p>
            </div>
          )
        })
      }
    </div>
  )
}
// TODO: 이름 누르면 player_id로 상세화면 이동하도록.. 하고싶구나

export default App;
