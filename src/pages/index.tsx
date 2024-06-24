import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  // const [sampleVal, setSampleVal] = useState(0);
  // 0 -> 未クリック
  // 1 -> 左クリック
  // 2 -> 旗

  // 0 -> ボム無し
  // 1 -> ボム有り

  // const isPlaying = userInputs.some((row) => row.some((input) => input !== 0));
  const isFailure = (userInputs: number[][], bombMap: number[][]) =>
    userInputs.some((row, y) => row.some((input, x) => input === 1 && bombMap[y][x] === 1));

  // -1 -> 石
  // 0 -> 画像無しセル
  // 1~8 -> 数字セル
  // 9 -> 石とはてな
  // 10 -> 石と旗
  // 11 -> ボムセル

  const board = [...Array(9)].map((_, y) => [...Array(9)].map((_, x) => ((y + x + 1) % 13) - 1));
  const zeroBoard = [...Array(9)].map(() => [...Array(9)].map(() => 0));
  const [userInputs, setUserInputs] = useState(zeroBoard);
  const [bombMap, setBombMap] = useState(zeroBoard);

  const directions = [
    [0, 1], //下
    [0, -1], //上
    [1, 0], //右
    [-1, 0], //左
    [1, 1], //右下
    [1, -1], //右上
    [-1, 1], //左下
    [-1, -1], //左上
  ];

  //ランダム取得
  function getRandomInt(min: number, max: number) {
    // min = Math.ceil(min);
    // max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  const newBombMap = structuredClone(bombMap);
  const newUserInputs = structuredClone(userInputs);

  //右クリック
  const clickR = (x: number, y: number) => {
    //デフォルトの右クリックのメニューが出ないようにする
    document.getElementsByTagName('html')[0].oncontextmenu = () => false;
    //右クリックでuserInputの0と2を入れ替える
    if (newUserInputs[y][x] === 1) return;
    newUserInputs[y][x] = newUserInputs[y][x] === 2 ? 0 : 2;
    setUserInputs(newUserInputs);
  };

  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    if (userInputs[y][x] === 0) {
      newUserInputs[y][x] = 1;

      // 初回クリック時の爆弾設置
      const inputfilter = (col: number) => newBombMap.flat().filter((v) => v === col).length;
      if (inputfilter(1) === 0) {
        // まだ爆弾が設置されていない場合
        while (inputfilter(1) < 10) {
          // 爆弾が10個になるまで設置
          const nx = getRandomInt(0, 8);
          const ny = getRandomInt(0, 8);
          if (nx !== x || ny !== y) {
            // クリックしたマスには設置しない
            newBombMap[ny][nx] = 1;
          }
        }
      }
      console.log(inputfilter(1));
    }

    setBombMap(newBombMap);
    setUserInputs(newUserInputs);
  };
  //空白連鎖
  function blank(x: number, y: number) {
    let count = 0;
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (board[ny] !== undefined && board[ny][nx] !== undefined) {
        if (newBombMap[ny][nx] === 1) {
          count++;
        }
      }
    }
    board[y][x] = count;
    if (count === 0) {
      // このマスの周りに爆弾がない場合
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (board[ny] !== undefined && board[ny][nx] !== undefined && board[ny][nx] === -1) {
          blank(nx, ny); // 隣接するマスも再帰的にチェック
        }
      }
    }
  }
  //旗置く
  for (let d = 0; d < 9; d++) {
    for (let c = 0; c < 9; c++) {
      if (userInputs[c][d] === 2) {
        board[c][d] = 10;
      }
      if (userInputs[c][d] === 0) {
        board[c][d] = -1;
      }
    }
  }
  //爆弾踏んだ時に爆弾表示
  if (isFailure(userInputs, bombMap)) {
    for (let d = 0; d < 9; d++) {
      for (let c = 0; c < 9; c++) {
        if (bombMap[c][d] === 1) {
          board[c][d] = 11;
        }
      }
    }
  }
  // 爆弾チェックと周囲の爆弾数を更新
  for (let d = 0; d < 9; d++) {
    for (let c = 0; c < 9; c++) {
      if (userInputs[c][d] === 1) {
        if (bombMap[c][d] === 1) {
          board[c][d] = 11; // 爆弾があるマス
        } else {
          blank(d, c); // 周囲の爆弾数を数えて、必要に応じて連鎖的に開ける
        }
      }
    }
  }
  console.table(board);
  return (
    <div className={styles.container}>
      <div className={styles.allall}>
        {/* 上の部分 */}
        <div className={styles.head}>
          <div className={styles.easy}>初級</div>
          <div className={styles.middle}>中級</div>
          <div className={styles.hard}>上級</div>
          <div className={styles.custom}>カスタム</div>
        </div>

        {/* 灰色全体 */}
        <div className={styles.allbackground}>
          <div className={styles.boardstyle}>
            {/* タイマー・ニコちゃん・旗 */}
            <div className={styles.gamehead}>
              <div className={styles.flag}>999</div>
              <button
                className={styles.reset}
                style={{ backgroundPosition: `30px 0` }}
                onClick={() => {
                  for (let d = 0; d < 9; d++) {
                    for (let c = 0; c < 9; c++) {
                      newBombMap[c][d] = 0;
                      newUserInputs[c][d] = 0;
                      board[c][d] = -1;
                    }
                  }
                  setBombMap(newBombMap);
                  setUserInputs(newUserInputs);
                }}
              />
              <div className={styles.timer}>999</div>
            </div>
            {/* マップ */}
            <div className={styles.backgroundmap}>
              {board.map((row, y) =>
                row.map((bomb, x) => (
                  <div
                    className={styles.cellStyle}
                    key={`${x}-${y}`}
                    onClick={() => clickHandler(x, y)}
                    onContextMenu={() => clickR(x, y)}
                    style={{
                      backgroundColor: bomb === -1 ? '#e4e4e4' : bomb === 10 ? '#e4e4e4' : '#bbb',
                      // ...(bomb === 0 && { backgroundPosition: `${-30 * n}px 0` }),
                    }}
                  >
                    {bomb !== -1 && bomb !== 0 && (
                      <div
                        className={styles.aaaa}
                        style={{ backgroundPosition: `${-30 * (board[y][x] - 1)}px 0` }}
                      />
                    )}
                    {bomb === 11 && (
                      <div className={styles.aaaa} style={{ backgroundPosition: `330px 0` }} />
                    )}
                    {bomb === 10 && (
                      <div className={styles.aaaa} style={{ backgroundPosition: `300px 0` }} />
                    )}
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

// アロー関数の()の中を指定しないと一個前の更新の情報になる
//clickHandlerの中はクリックされたことが保証されているが、それ以外はされていないのでfor文で確かめる必要あり
//userImputはclickHandlerの外で変更したくないので別の条件式を考える
