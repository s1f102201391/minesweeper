import { useState, useEffect } from 'react';

export const useGame = () => {
  type difficultyType = 'easy' | 'middle' | 'hard' | 'custom';
  const initialRows = 9;
  const initialCols = 9;
  const bombCount = 10;
  const [rows, setRows] = useState(initialRows);
  const [cols, setCols] = useState(initialCols);
  const [bomb, setbombCount] = useState(bombCount);
  const [temprows, settempRows] = useState(initialRows);
  const [tempcols, settempCols] = useState(initialCols);
  const [tempbomb, settempbombCount] = useState(bombCount);
  const [difficulty, setDifficulty] = useState<difficultyType>('easy');
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
    setRemainingBombs(bomb);

    setCount(0);
    stopTimer();
  };

  // 初期状態のボードと爆弾マップ
  const [userInputs, setUserInputs] = useState(createBoard(initialRows, initialCols));
  const [bombMap, setBombMap] = useState(createBoard(initialRows, initialCols));

  // const isPlaying = userInputs.some((row) => row.some((input) => input !== 0));
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
    if (isClear === true) return;
    if (newUserInputs[y][x] === 2) {
      newUserInputs[y][x] = 0;
      startTimer();
      setRemainingBombs(remainingBombs + 1); // 旗を外した場合は+1
    } else {
      startTimer();
      newUserInputs[y][x] = 2;
      setRemainingBombs(remainingBombs - 1); // 旗を置いた場合は-1
    }
    setUserInputs(newUserInputs);
  };

  const clickHandler = (x: number, y: number) => {
    console.log(x, y);
    if (userInputs[y][x] === 0) {
      if (isFailure(userInputs, bombMap)) return;
      if (clearfilter(0) === remainingBombs) return;
      newUserInputs[y][x] = 1;
      startTimer(); // タイマーを開始

      // 初回クリック時の爆弾設置
      const inputfilter = (col: number) => newBombMap.flat().filter((v) => v === col).length;
      if (inputfilter(1) === 0) {
        if (userInputs[y][x] === 2) return;
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
      // console.log(inputfilter(1));
    }
    if (bombMap[y][x] === 1) {
      // クリックしたセルが爆弾の場合
      setUserInputs(newUserInputs);
      setBombMap(newBombMap);
      return;
    }
    if (isFailure(userInputs, bombMap)) return;
    if (clearfilter(0) === remainingBombs) return;
    if (isClear === true) return;

    setBombMap(newBombMap);
    setUserInputs(newUserInputs);
    if (userInputs[y][x] === 2) return;
    blank(x, y);
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
        // if (
        //   newBombMap[ny] !== undefined &&
        //   newBombMap[ny][nx] !== undefined &&
        //   newBombMap[ny][nx] === 1
        // )
        //   return;
        if (
          newUserInputs[ny] !== undefined &&
          newUserInputs[ny][nx] !== undefined &&
          newUserInputs[ny][nx] === 0 &&
          bombMap[ny][nx] !== 1
        ) {
          newUserInputs[ny][nx] = 1;
          blank(nx, ny);
        }
        if (
          newUserInputs[ny] !== undefined &&
          newUserInputs[ny][nx] !== undefined &&
          newUserInputs[ny][nx] === 2 &&
          bombMap[ny][nx] !== 1
        ) {
          newUserInputs[ny][nx] = 1;
          blank(nx, ny);
          setRemainingBombs(bomb);
        }
      }
    }
  }

  //ボードサイズを変更する関数
  const changeBoardSize = (
    newRows: number,
    newCols: number,
    difficulty: difficultyType,
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
          if (userInputs[c][d] !== 1) {
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
  const isClear = board.every((row, y) =>
    row.every((cell, x) => {
      if (bombMap[y][x] !== 1) {
        return userInputs[y][x] === 1;
      }
      return true;
    }),
  );
  if (isClear === true) {
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
  const clearfilter = (col: number) => userInputs.flat().filter((v) => v === col).length;
  // if (isPlaying) {
  //   if (clearfilter(0) === remainingBombs) {
  //     for (let d = 0; d < cols; d++) {
  //       for (let c = 0; c < rows; c++) {
  //         if (userInputs[c]?.[d] !== undefined && userInputs[c][d] === 0) {
  //           board[c][d] = 10;
  //         }
  //       }
  //     }
  //     stopTimer();
  //     nico = 2;
  //   }
  // }
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
    if (tempcols * temprows <= tempbomb) {
      alert('爆弾数がマス以上の場合は適用できません');
      return;
    }
    if (temprows === null) return;
    if (tempcols === null) return;
    if (tempbomb < 0) {
      alert('爆弾数がマイナスの場合は適用できません');
      return;
    }
    if (tempcols % 1 !== 0) {
      alert('少数は適用できません');
      return;
    }
    if (temprows % 1 !== 0) {
      alert('少数は適用できません');
      return;
    }
    changeBoardSize(tempcols, temprows, 'custom', tempbomb);
    setCount(0);
    stopTimer();
  };
  console.table(bombMap);

  return {
    reset,
    count,
    clickR,
    clickHandler,
    nico,
    handleRowsChange,
    handleColsChange,
    handleBombChange,
    applyClick,
    changeBoardSize,
    setCount,
    stopTimer,
    difficulty,
    remainingBombs,
    board,
    cols,
  };
};
