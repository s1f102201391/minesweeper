import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  const [sampleVal, setSampleVal] = useState(0);
  // 0 -> 未クリック
  // 1 -> 左クリック
  // 2 -> はてな
  // 3 -> 旗
  const [userInputs, setUserInputs] = useState([
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

  const bombCount = 10;
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

  const isPlaying = userInputs.some((row) => row.some((input) => input !== 0));
  const isFailure = userInputs.some((row, y) =>
    row.some((input, x) => input === 1 && bombMap[y][x] === 1),
  );

  // -1 -> 石
  // 0 -> 画像無しセル
  // 1~8 -> 数字セル
  // 9 -> 石とはてな
  // 10 -> 石と旗
  // 11 -> ボムセル

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
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }
  // クリックしたとき
  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    if (userInputs[y][x] !== 0) {
      userInputs[y][x] = 1;
      const inputflat = userInputs.flat();
      const inputfilter = inputflat.filter((v) => v === 1);
      //初回クリック時
      if (inputfilter.length === 1) {
        let i = 0;
        const board = structuredClone(bombMap);
        while (i < 11) {
          const nx = getRandomInt(0, 8);
          const ny = getRandomInt(0, 8);
          userInputs[ny][nx] = 1;
          i++;
        }
        setBombMap(board);
      }
    }
  };

  console.table(userInputs);
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
              {userInputs.map((row, y) =>
                row.map((bomb, x) => (
                  <div
                    className={styles.cellStyle}
                    key={`${x}-${y}`}
                    onClick={() => clickHandler(x, y)}
                    style={{
                      backgroundColor: bomb === 1 ? '#00ff1a' : '#bbb',
                      ...(bomb === 2 && { backgroundPosition: `-330px 0` }),
                    }}
                  >
                    {bomb !== 0 && (
                      <div className={styles.reset} style={{ backgroundPosition: `-330px 0` }} />
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
