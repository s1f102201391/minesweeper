import { useState, useEffect } from 'react';
import styles from './index.module.css';

const Home = () => {
  const initialRows = 9;
  const initialCols = 9;
  const bombCount = 10;
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);
  const [bomb, setbombCount] = useState(bombCount);
  const [temprows, settempRows] = useState(initialRows);
  const [tempcols, settempCols] = useState(initialCols);
  const [tempbomb, settempbombCount] = useState(bombCount);
  const [difficulty, setDifficulty] = useState('easy');
  const [remainingBombs, setRemainingBombs] = useState(bombCount);

  // ボードを生成する関数
  const createBoard = (rows: number, cols: number) => {
    return [...Array(rows)].map(() => Array(cols).fill(0));
  };

  //リセットボタンの関数
  const reset = () => {
    for (let d = 0; d < cols; d++) {
      for (let c = 0; c < rows; c++) {
        newBombMap[c][d] = 0;
        newUserInputs[c][d] = 0;
        board[c][d] = -1;
      }
    }

    const firstbomb =
      difficulty === 'easy' ? 10 : difficulty === 'middle' ? 40 : difficulty === 'hard' ? 99 : 0;

    setBombMap(createBoard(rows, cols));
    setUserInputs(createBoard(rows, cols));
    setRemainingBombs(firstbomb);

    setCount(0);
    stopTimer();
  };

  // 初期状態のボードと爆弾マップ
  const [userInputs, setUserInputs] = useState(createBoard(initialRows, initialCols));
  const [bombMap, setBombMap] = useState(createBoard(initialRows, initialCols));

  // const isPlaying = (userInputs: number[][]) =>
  //   userInputs.some((row) => row.some((input) => input !== 0));
  const isFailure = (userInputs: number[][], bombMap: number[][]) =>
    userInputs.some((row, y) => row.some((input, x) => input === 1 && bombMap[y][x] === 1));

  const board = [...Array(rows)].map(() => Array(cols).fill(-1));

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
  //タイマー
  const [count, setCount] = useState(0);
  const [timerId, setTimerId] = useState<NodeJS.Timeout | null>(null);

  //タイマーの開始と停止関数
  const startTimer = () => {
    if (!timerId) {
      const id = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount >= 999) {
            clearInterval(id);
            setTimerId(null);
            return 999;
          }
          return prevCount + 1;
        });
      }, 1000);
      setTimerId(id);
    }
  };
  const stopTimer = () => {
    if (timerId) {
      clearInterval(timerId);
      setTimerId(null);
    }
  };

  //タイマーのクリーンアップ
  useEffect(() => {
    return () => {
      if (timerId) {
        clearInterval(timerId);
      }
    };
  }, [timerId]);

  //ランダム取得
  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  const newBombMap = structuredClone(bombMap);
  const newUserInputs = structuredClone(userInputs);

  //右クリック
  const clickR = (x: number, y: number, event: React.MouseEvent) => {
    //デフォルトの右クリックのメニューが出ないようにする
    event.preventDefault();
    //右クリックでuserInputの0と2を入れ替える
    if (newUserInputs[y][x] === 1) return;
    if (isFailure(userInputs, bombMap)) return;
    if (clearfilter(0) === remainingBombs) return;
    if (newUserInputs[y][x] === 2) {
      newUserInputs[y][x] = 0;
      setRemainingBombs(remainingBombs + 1); // 旗を外した場合は+1
    } else {
      newUserInputs[y][x] = 2;
      setRemainingBombs(remainingBombs - 1); // 旗を置いた場合は-1
    }
    setUserInputs(newUserInputs);
  };

  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    if (userInputs[y][x] === 0) {
      newUserInputs[y][x] = 1;
      startTimer(); // タイマーを開始

      // 初回クリック時の爆弾設置
      const inputfilter = (col: number) => newBombMap.flat().filter((v) => v === col).length;
      if (inputfilter(1) === 0) {
        // まだ爆弾が設置されていない場合
        while (inputfilter(1) < bomb) {
          // 爆弾が10個になるまで設置
          const nx = getRandomInt(0, cols);
          const ny = getRandomInt(0, rows);
          if (nx !== x || ny !== y) {
            // クリックしたマスには設置しない
            if (newBombMap[ny] !== undefined && newBombMap[ny][nx] !== undefined) {
              newBombMap[ny][nx] = 1;
            }
          }
        }
      }
      console.log(inputfilter(1));
      if (isFailure(userInputs, bombMap)) return;
      if (clearfilter(0) === remainingBombs) return;
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
      if (newBombMap[ny] !== undefined && newBombMap[ny][nx] !== undefined) {
        if (newBombMap[ny][nx] === 1) {
          count++;
        }
      }
    }
    board[y][x] = count;
    if (count === 0) {
      for (const [dx, dy] of directions) {
        const nx = x + dx;
        const ny = y + dy;
        if (
          newUserInputs[ny] !== undefined &&
          newUserInputs[ny][nx] !== undefined &&
          newUserInputs[ny][nx] === 0
        ) {
          newUserInputs[ny][nx] = 1;
          blank(nx, ny);
        }
      }
    }
  }

  //ボードサイズを変更する関数
  const changeBoardSize = (
    newRows: number,
    newCols: number,
    difficulty: string,
    newBomb: number,
  ) => {
    setRows(newRows);
    setCols(newCols);
    setbombCount(newBomb);
    setDifficulty(difficulty);
    setUserInputs(createBoard(newRows, newCols));
    setBombMap(createBoard(newRows, newCols));
    setRemainingBombs(newBomb);
  };

  //旗置く
  for (let d = 0; d < cols; d++) {
    for (let c = 0; c < rows; c++) {
      if (userInputs[c]?.[d] !== undefined && userInputs[c][d] === 2) {
        board[c][d] = 10;
      }
      if (userInputs[c]?.[d] !== undefined && userInputs[c][d] === 0) {
        board[c][d] = -1;
      }
    }
  }

  //爆弾踏んだ時に爆弾表示
  let nico = 0;
  if (isFailure(userInputs, bombMap)) {
    for (let d = 0; d < cols; d++) {
      for (let c = 0; c < rows; c++) {
        if (bombMap[c]?.[d] !== undefined && bombMap[c][d] === 1) {
          if (userInputs[c][d] === 0) {
            board[c][d] = 11;
          } else {
            board[c][d] = 25;
          }
        }
      }
    }
    stopTimer(); // タイマーを停止
    nico = 1;
  }

  //クリア
  const clearfilter = (col: number) => userInputs.flat().filter((v) => v === col).length;
  if (clearfilter(0) === remainingBombs) {
    for (let d = 0; d < cols; d++) {
      for (let c = 0; c < rows; c++) {
        if (userInputs[c]?.[d] !== undefined && userInputs[c][d] === 0) {
          board[c][d] = 10;
        }
      }
    }
    stopTimer();
    nico = 2;
  }

  // 爆弾チェックと周囲の爆弾数を更新
  for (let d = 0; d < cols; d++) {
    for (let c = 0; c < rows; c++) {
      if (userInputs[c]?.[d] !== undefined && userInputs[c][d] === 1) {
        if (bombMap[c]?.[d] !== undefined && bombMap[c][d] === 1) {
          board[c][d] = 25; // 爆弾があるマス
        } else {
          blank(d, c); // 周囲の爆弾数を数えて、必要に応じて連鎖的に開ける
        }
      }
    }
  }

  console.table(board);
  console.table(userInputs);
  console.table(bombMap);
  //inputの値を仮の関数にぶち込む
  const handleRowsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    settempRows(Number(e.target.value));
  };
  const handleColsChange = (f: React.ChangeEvent<HTMLInputElement>) => {
    settempCols(Number(f.target.value));
  };
  const handleBombChange = (g: React.ChangeEvent<HTMLInputElement>) => {
    settempbombCount(Number(g.target.value));
  };

  const applyClick = () => {
    // setRows(temprows);
    // setCols(tempcols);
    // setbombCount(tempbomb);
    if (tempcols * temprows < tempbomb) return;
    changeBoardSize(temprows, tempcols, 'custom', tempbomb);
  };
  return (
    <div className={styles.container}>
      <div className={styles.allall}>
        {/* 上の部分 */}
        <div className={styles.head}>
          <div
            className={styles.easy}
            onClick={() => {
              changeBoardSize(9, 9, 'easy', 10);
              setCount(0);
              stopTimer();
            }}
          >
            初級
          </div>
          <div
            className={styles.middle}
            onClick={() => {
              changeBoardSize(16, 16, 'middle', 40);
              setCount(0);
              stopTimer();
            }}
          >
            中級
          </div>
          <div
            className={styles.hard}
            onClick={() => {
              changeBoardSize(16, 30, 'hard', 99);
              setCount(0);
              stopTimer();
            }}
          >
            上級
          </div>
          <div
            className={styles.custom}
            onClick={() => {
              changeBoardSize(16, 30, 'custom', 10);
              setCount(0);
              stopTimer();
            }}
          >
            カスタム
          </div>
        </div>
        {difficulty === 'custom' && (
          <div className={styles.customApply}>
            <label>横幅：</label>
            <input type="number" onChange={handleRowsChange} />
            <label>縦幅：</label>
            <input type="number" onChange={handleColsChange} />
            <label>爆弾数：</label>
            <input type="number" onChange={handleBombChange} />
            <button onClick={() => applyClick()}>適用</button>
          </div>
        )}

        {/* 灰色全体 */}
        <div className={styles.allbackground}>
          <div className={styles.boardstyle}>
            {/* タイマー・ニコちゃん・旗 */}
            <div className={styles.gamehead}>
              <div className={styles.flag} id="remainingBombs">
                {remainingBombs}
              </div>
              <button
                className={styles.reset}
                onClick={() => reset()}
                style={{
                  backgroundPosition: nico === 0 ? `90px 0` : nico === 1 ? `30px 0` : `60px 0`,
                }}
              />
              <div className={styles.timer}>{count}</div>
            </div>
            {/* マップ */}
            <div
              className={`${styles.backgroundmap} ${styles[difficulty]}`}
              style={
                difficulty === 'custom'
                  ? { gridTemplateColumns: `repeat(${cols}, 40px)` }
                  : undefined
              }
            >
              {board.map((row, y) =>
                row.map((bomb, x) => (
                  <div
                    className={styles.cellStyle}
                    key={`${x}-${y}`}
                    onClick={() => clickHandler(x, y)}
                    onContextMenu={(event) => clickR(x, y, event)}
                    style={{
                      backgroundColor:
                        bomb === -1
                          ? '#c6c6c6'
                          : bomb === 10
                            ? '#c6c6c6'
                            : bomb === 25
                              ? '#f00'
                              : '#c6c6c6',
                      borderColor:
                        bomb === -1
                          ? '#fff #7b7b7b #7b7b7b #fff'
                          : bomb === 10
                            ? '#fff #7b7b7b #7b7b7b #fff'
                            : '#7b7b7b #fff #fff #7b7b7b',
                    }}
                  >
                    {bomb !== -1 && bomb !== 0 && (
                      <div
                        className={styles.aaaa}
                        style={{ backgroundPosition: `${-30 * (board[y][x] - 1)}px 0` }}
                      />
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

// 0 -> 未クリック
// 1 -> 左クリック
// 2 -> 旗

// 0 -> ボム無し
// 1 -> ボム有り

// -1 -> 石
// 0 -> 画像無しセル
// 1~8 -> 数字セル
// 9 -> 石とはてな
// 10 -> 石と旗
// 11 -> ボムセル
