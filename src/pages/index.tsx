import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  // const [sampleVal, setSampleVal] = useState(0);
  // 0 -> 未クリック
  // 1 -> 左クリック
  // 2 -> はてな
  // 3 -> 旗
  const [userInputs, setUserInputs] = useState<(0 | 1 | 2 | 3)[][]>([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  // const bombCount = 10;
  // 0 -> ボム無し
  // 1 -> ボム有り
  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  // const isPlaying = userInputs.some((row) => row.some((input) => input !== 0));
  // const isFailure = userInputs.some((row, y) =>
  //   row.some((input, x) => input === 1 && bombMap[y][x] === 1),
  // );

  // -1 -> 石
  // 0 -> 画像無しセル
  // 1~8 -> 数字セル
  // 9 -> 石とはてな
  // 10 -> 石と旗
  // 11 -> ボムセル
  const [board, setBoard] = useState([
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  ]);

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
  // クリックしたとき
  const newBombMap = structuredClone(bombMap);
  const newUserInputs = structuredClone(userInputs);
  const newBoard = structuredClone(board);

  //右クリック
  const clickR = (x: number, y: number) => {
    //デフォルトの右クリックのメニューが出ないようにする
    document.getElementsByTagName('html')[0].oncontextmenu = () => false;
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

      // 爆弾チェックと周囲の爆弾数を更新
      if (newBombMap[y][x] === 1) {
        newBoard[y][x] = 11; // 爆弾があるマスを示す特別な値
      } else {
        blank(x, y); // 周囲の爆弾数を数えて、必要に応じて連鎖的に開ける
      }
    }

    setBombMap(newBombMap);
    setUserInputs(newUserInputs);
    setBoard(newBoard);
  };

  function blank(x: number, y: number) {
    let count = 0;
    for (const [dx, dy] of directions) {
      const nx = x + dx;
      const ny = y + dy;
      if (newBoard[ny] !== undefined && newBoard[ny][nx] !== undefined) {
        if (newBombMap[ny][nx] === 1) {
          count++;
        }
      }
    }
    newBoard[y][x] = count;
    if (count === 0) {
      // このマスの周りに爆弾がない場合
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          newBoard[ny] !== undefined &&
          newBoard[ny][nx] !== undefined &&
          newUserInputs[ny][nx] === 0
        ) {
          newUserInputs[ny][nx] = 1;
          blank(nx, ny); // 隣接するマスも再帰的にチェック
        }
      }
    }
  }
  console.table(newUserInputs);

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
              <div className={styles.reset} />
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
                      backgroundColor: bomb === -1 ? '#e4e4e4' : '#bbb',
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

/* // const [sampleVal, setSampleVal] = useState(0);
//   console.log(sampleVal);
//   return (
//     <div className={styles.container}>
//       <div
//         className={styles.sampleStyle}
//         style={{ backgroundPosition: `${sampleVal * -30}px 0` }}
//       />
//       <button onClick={() => setSampleVal((val) => (val + 1) % 14)}>Sample</button>
//     </div>
//   ); */
