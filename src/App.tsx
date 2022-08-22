import React from 'react';
import * as rxjs from 'rxjs';

function App() {
  const onChangeKeyword = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value)
  }

  return (
    <div className="App">
      <h1>Hi</h1>
      <input id={'keyword'} type={'text'} onChange={onChangeKeyword} />

      <div id={'result'}></div>
    </div>
  );
}

export default App;
