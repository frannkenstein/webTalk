import { useState, useEffect, memo, useRef } from "react";
import "./Message.scss";
import Reply from "../Rep/Reply";
import { useDispatch } from "react-redux";
import { loadReplyFor } from "../../Redux/actions/loadReplyAction";
import moment from "moment";

const Message = ({ message, visible, userName, key, onClick }) => {
  const dispatch = useDispatch();

  const [time, setTime] = useState("");
  const scrollRefArray = useRef();

  useEffect(() => {
    let currentTimestamp = new Date(message?.time);

    setTime(moment(currentTimestamp).format("MMMM Do YYYY, h:mm:ss a"));

    let ele = scrollRefArray.current;

    ele &&
      ele.scrollIntoView({
        top: ele.scrollHeight,
        left: 0,
      });
  }, [message]);

  const handleReply = () => {
    dispatch(loadReplyFor(message));
  };

  return (
    <div
      className={`messageContainer flex-column align-start  ${
        visible ? " show" : ""
      }`}
      key={key}
      ref={scrollRefArray}
      onClick={onClick}
    >
      {visible ? (
        <div className="flex-row align-start">
          <span className="name">
            {localStorage.getItem("userId") === message.senderId
              ? localStorage.getItem("userName")
              : userName}
          </span>
          <span className="date">{time}</span>
        </div>
      ) : null}

      <div className="messageSection flex-column align-start">
        <span className="date flex-row">{time}</span>
        <div className="replyIcon">
          <Reply handleReply={handleReply} />
        </div>

        <li>
          {!message?.message.attachments ? (
            message?.message?.message[0] !== "/" ? (
              <span className="messageFont"> {message?.message.message}</span>
            ) : (
              <img
                src={`http://localhost:3001${message?.message.message}`}
                alt="img"
                style={{ width: "50%" }}
              />
            )
          ) : (
            <div>
              <div className="repliedSpan">{message?.message.replied}</div>
              <span className="repliedMessageSpan">
                {message?.message.message}
              </span>
            </div>
          )}
        </li>
      </div>
    </div>
  );
};

export default memo(Message);
