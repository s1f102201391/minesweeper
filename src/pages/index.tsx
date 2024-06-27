import { useGame } from '../hooks/useGame';
import { Board } from '../conpornents/Board/Board';

const Home = () => {
  const {
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
  } = useGame();

  return (
    <Board
      changeBoardSize={changeBoardSize}
      setCount={setCount}
      stopTimer={stopTimer}
      difficulty={difficulty}
      handleRowsChange={handleRowsChange}
      handleColsChange={handleColsChange}
      handleBombChange={handleBombChange}
      applyClick={applyClick}
      remainingBombs={remainingBombs}
      reset={reset}
      nico={nico}
      count={count}
      cols={cols}
      board={board}
      clickHandler={clickHandler}
      clickR={clickR}
    />
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

//旗置いてもタイマー@
//はたおいたばくだんもあかくなる@
//適用で初期値@
//縦と横逆@
//小数点@
//ばくだんがまいなすになる@
//適用でタイマーリセットしない@
//
