// 다른 컴포넌트의 부모 역할을 하며 다양한 상태를 종합적으로 관리하는 역할

// 1
import React, { useState } from "react";
import styles from "./MainContainer.module.css";
import dayjs from "dayjs";
import { Input, Goal } from "../../components";
import { MdPlaylistAdd } from "react-icons/md";

const MainContainer = () => {
  // 2
  const [memoData, setMemoData] = useState(new Map());
  const [currentDate, setCurrentDate] = useState("");
  const [goalMsg, setGoalMsg] = useState("");
  // 3
  const onAddDateHandler = () => {
    const tempCurrentDate = dayjs().format("YYYY.MM.DD HH:mm:ss");
    if (memoData.has(tempCurrentDate)) return;
    setCurrentDate(tempCurrentDate);
    setMemoData((prev) => new Map(prev).set(tempCurrentDate, []));
  };

  // 4
  const onDateClick = (e) => {
    const { id } = e.target.dataset;
    setCurrentDate(id);
  };

  // 5
  const onMsgClickHandler = (e) => {
    e.preventDefault();
    const newGoalList = memoData.get(currentDate);
    setMemoData((prev) =>
      new Map(prev).set(currentDate, [
        ...newGoalList,
        { msg: goalMsg, status: false },
      ])
    );
    setGoalMsg("");
  };

  // 6
  const onChangeMsgHandler = (e) => {
    setGoalMsg(e.target.value);
  };

  // 7
  const onCheckChange = (e) => {
    const checked = e.target.checked;
    const msg = e.target.dataset.msg;
    const currentGoalList = memoData.get(currentDate);
    const newGoal = currentGoalList.map((v) => {
      let temp = { ...v };
      if (v.msg === msg) {
        temp = { msg: v.msg, status: checked };
      }
      return temp;
    });
    setMemoData((prev) => new Map(prev).set(currentDate, [...newGoal]));
  };

  return (
    <div className={styles.memoContainer}>
      <div className={styles.memoWrap}>
        <nav className={styles.sidebar}>
          <ul className={styles.dateList}>
            {
              // 8
              Array.from(memoData.keys()).map((v) => (
                <li
                  className={styles.li}
                  key={v}
                  data-id={v}
                  onClick={onDateClick}
                >
                  {v}
                </li>
              ))
            }
          </ul>
          <div className={styles.addWrap}>
            <MdPlaylistAdd
              size="30"
              color="#edd200"
              style={{ cursor: "pointer" }}
              onClick={onAddDateHandler}
            />
          </div>
        </nav>
        <section className={styles.content}>
          {memoData.size > 0 && (
            <>
              <ul className={styles.goals}>
                {memoData.get(currentDate).map((v, i) => (
                  <li key={`goal_${i}`}>
                    <Goal
                      id={`goal_${i}`}
                      msg={v.msg}
                      status={v.status}
                      onCheckChange={onCheckChange}
                    />
                  </li>
                ))}
              </ul>
              <Input
                valuse={goalMsg}
                onClick={onMsgClickHandler}
                onChange={onChangeMsgHandler}
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default MainContainer;

/*

1. 앞서 작성한 컴포넌트와 라이브러리를 임포트 한다.
2. 날짜에 맞는 to-do 리스트와 현재 클릭한 날짜, 목표를 작성하는 input value 변수를 작성한다.
    
    const [memoData, setMemoData] = useState(new Map());
    
    각 날짜에 맞는 to-do리스트를 관리하기 위해서 Map 객체를 이용했다. Map 객체는 키-값 형태로, 키로는 날짜를 할당하고 값으로는 to-do리스트를 할당한다.

3. onAddDateHandler()는 화면에 + 버튼을 누르면 호출된다.

    const onAddDateHandler = () => {
        const tempCurrentDate = dayjs().format("YYYY.MM.DD HH:mm:ss");
        if (memoData.has(tempCurrentDate)) return;
        setCurrentDate(tempCurrentDate);
        setMemoData((prev) => new Map(prev).set(tempCurrentDate, []));
    };

4. onDateClick()은 왼쪽에 있는 날짜를 클릭하면 호출된다.
5. onMsgClickHandler()는 목표를 작성한 후 Add 버튼을 클릭하면 실행된다.

    const onMsgClickHandler = (e) => {
        e.preventDefault();
        const newGoalList = memoData.get(currentDate);
        setMemoData((prev) =>
            new Map(prev).set(currentDate, [
                ...newGoalList,
                { msg: goalMsg, status: false },
            ])
        );
        setGoalMsg("");
    };
    먼저 memoData에서 현재 날짜에 해당하는 to-do 리스트 데이터를 불러 온다. 불러온 to-do 데이터와 새로 작성한 to-do 목록을 배열에 추가한 후에 setMemoData()를 업데이트 한다.
    위 로직에서 status: false라는 status는 체크박스에 체그했을 때 true로 변환되며 글에 밑줄을 긋는 역할을 한다.

6. onChangeMsgHandler()는 input 박스의 onChange 이벤트에 등록되고 to-do 목록을 작성할 때 호출된다.
7. onCheckChange()는 체크박스를 클릭했을 때 실행된다.

    const onCheckChange = (e) => {
        const checked = e.target.checked;
        const msg = e.target.dataset.msg;
        const currentGoalList = memoData.get(currentDate);
        const newGoal = currentGoalList.map((v) => {
            let temp = { ...v };
            if (v.msg === msg) {
                temp = { msg: v.msg, status: checked };
            }
            return temp;
        });
        setMemoData((prev) => new Map(prev).set(currentDate, [...newGoal]));
    };
    파라미터로 전달받은 이벤트 객체(e)에서 체크 유무와 메시지 내용을 확인할 수 있다.
    전달받은 to-do 항목과 가지고 있는 to-do 리스트의 값을 순회하며 비교한다. 동일한 값이 있다면 status를 알맞게 변환한다.

8. Map 객체를 배열로 변환하는 과정
        Array.from(memoData.keys()).map((v) => (
            <li
                className={styles.li}
                key={v}
                data-id={v}
                onClick={onDateClick}
            >
                {v}
            </li>
        ))
    
        Array.from()을 이용해서 map의 key() 메소드를 이용해서 배열로 변환한다.




*/
