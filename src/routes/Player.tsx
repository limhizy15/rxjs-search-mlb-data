import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import * as rxjs from 'rxjs';
import { API_URL, PlayerType } from "../utils";

export default function Player() {
    const params = useParams();
    const [player, setPlayer] = useState({} as PlayerType);

    useEffect(() => {
        const subs = rxjs.of(params.playerID).pipe(
            // mergeMap은 그냥 스트림 오는거 다 merge.. 순서에 상관없이 오는대로
            rxjs.mergeMap(id => {
                return rxjs.from(axios.get(`${API_URL}/json/named.player_info.bam?sport_code='mlb'&player_id=${id}`)).pipe(
                    rxjs.map(result => {
                        setPlayer(result.data.player_info.queryResults.row)
                    }),
                    rxjs.retry(2),
                    rxjs.catchError(err => rxjs.of(err))
                  )
            })
        ).subscribe()

        return () => subs.unsubscribe();
    }, [])

    if (player == null) {
        return (
            <div>
                <p>상세 정보를 불러올 수 없어요</p>
            </div>
        )
    }

    return (
        <div>
            <h1>{player.name_display_first_last}</h1>
            {JSON.stringify(player)}
        </div>
    )
}