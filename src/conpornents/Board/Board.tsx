import type { SetStateAction } from 'react';
import styles from './Board.module.css';
type difficultyType = 'easy' | 'middle' | 'hard' | 'custom';
type Props = {
  changeBoardSize: (
    newRows: number,
    newCols: number,
    difficulty: difficultyType,
    newBomb: number,
  ) => void;
  setCount: (value: SetStateAction<number>) => void;
  stopTimer: () => void;
  difficulty: difficultyType;
  handleRowsChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleColsChange: (f: React.ChangeEvent<HTMLInputElement>) => void;
  handleBombChange: (g: React.ChangeEvent<HTMLInputElement>) => void;
  applyClick: () => void;
  remainingBombs: number;
  reset: () => void;
  nico: number;
  count: number;
  cols: number;
  board: number[][];
  clickHandler: (x: number, y: number) => void;
  clickR: (x: number, y: number, event: React.MouseEvent) => void;
};
export const Board = ({
  changeBoardSize,
  setCount,
  stopTimer,
  difficulty,
  handleRowsChange,
  handleColsChange,
  handleBombChange,
  applyClick,
  remainingBombs,
  reset,
  nico,
  count,
  cols,
  board,
  clickHandler,
  clickR,
}: Props) => (
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
            changeBoardSize(9, 9, 'custom', 10);
            setCount(0);
            stopTimer();
          }}
        >
          カスタム
        </div>
      </div>
      {difficulty === 'custom' && (
        <div className={styles.customApply}>
          <label>幅：</label>
          <input type="number" onChange={handleRowsChange} />
          <label>高さ：</label>
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
              difficulty === 'custom' ? { gridTemplateColumns: `repeat(${cols}, 40px)` } : undefined
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
