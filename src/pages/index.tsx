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
  const board: number[][] = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  ];

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

  //右クリック

  //ランダム取得
  function getRandomInt(min: number, max: number) {
    // min = Math.ceil(min);
    // max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
  // クリックしたとき
  const newBombMap = structuredClone(bombMap);
  const newUserInputs = structuredClone(userInputs);

  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    if (bombMap[y][x] === 0) {
      newBombMap[y][x] = 2;
      const inputfilter = (col: number) => newBombMap.flat().filter((v) => v === col).length;

      //初回クリック時爆弾設置
      if (inputfilter(2) === 1) {
        while (inputfilter(1) < 10) {
          const nx = getRandomInt(0, 8);
          const ny = getRandomInt(0, 8);
          newBombMap[ny][nx] = 1;
          console.log(newBombMap[ny][nx]);
          if (newBombMap[ny][nx] === 1) {
            board[ny][nx] = 11;
          }
        }
        newBombMap[y][x] = 0;
        board[y][x] = 0;
      }
      console.log(inputfilter(1));
    }

    setBombMap(newBombMap);
    console.table(newBombMap);
    console.table(board);
  };
  //81マス全部の8方向の爆弾数n
  let n = 0;
  const aroundBomb = () => {
    for (let d = 0; d < 9; d++) {
      for (let c = 0; c < 9; c++) {
        if (newBombMap[c][d] !== 1) {
          for (const item of directions) {
            const [a, b] = item;
            const X = d + a;
            const Y = c + b;

            if (
              newBombMap[Y] !== undefined &&
              newBombMap[Y][X] !== undefined &&
              newBombMap[Y][X] === 1
            ) {
              n += 1;
              console.log(n);
            }
          }
        }
      }
    }
  };
  aroundBomb;

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
                    style={{
                      backgroundColor: bomb === -1 ? '#00ff1a' : '#bbb',
                      ...(bomb === 0 && { backgroundPosition: `${-30 * n}px 0` }),
                    }}
                  >
                    {/* {bomb !== 0 && (
                      <div
                        className={styles.reset}
                        style={{ backgroundPosition: `${-30 * n}px 0` }}
                      />
                    )} */}
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
