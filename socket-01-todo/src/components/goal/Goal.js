import React from "react";
import styles from "./Goal.module.css";

// 1
const Goal = ({ id, status, msg, onCheckChange }) => {
  return (
    <div className={styles.goalWrap}>
      <label
        className={status ? styles.textDisabled : styles.text}
        htmlFor={id}
      >
        {
          // 2
          status && <div className={styles.clean} />
        }
        <input
          type="checkbox"
          id={id}
          name={id}
          data-msg={msg}
          onChange={onCheckChange}
          checked={status}
        />
        {msg}
      </label>
    </div>
  );
};

export default Goal;

/*
1. props로 라벨을 구분할 수 있는 id값과 to-do 메시지, 체크 상태인지를 구분하는 status 값을 받는다.
    또한 check 이벤트를 등록할 수 있는 함수를 추가한다.

2. status 값이 true라면 to-do 메시지에 줄을 긋는 역할을 한다.

*/
