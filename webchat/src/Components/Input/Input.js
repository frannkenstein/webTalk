import { useState } from "react";
import "./Input.scss";
import { memo } from "react";
import AttachFileRoundedIcon from "@material-ui/icons/AttachFileRounded";
import MyButton from "../InputComponents/MyButton";
import "emoji-mart/css/emoji-mart.css";
import { Picker } from "emoji-mart";
import { ReactComponent as Emoji } from "../../Assets/emoji_icon.svg";
const Input = ({
  text,
  setText,
  handleCreate,
  variant,
  sender,
  receiver,
  setFile,
  handleSchduled,
}) => {
  const [show, setShow] = useState(false);
  const [senderId] = useState(sender);
  const [receiverId] = useState(receiver);

  const onEmojiClick = (event, emojiObject) => {
    setText(emojiObject.emoji);
  };

  return (
    <div className="completeInput flex-column adjust">
      <div className="inputSection flex-row adjust">
        <Emoji
          style={{ width: "40px", marginLeft: "10px", cursor: "pointer" }}
          onClick={() => setShow((prevState) => (prevState = !show))}
        />
        {show && (
          <Picker
            style={{
              position: "absolute",
              bottom: "100%",
              left: "0%",
              width: "250px",
            }}
          />
        )}
        <input
          placeholder={
            variant === "Message" ? "Type your message..." : "Enter Group Name"
          }
          id="textarea"
          className="font-h5"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
          autoComplete="off"
        />
        <div className="flex-row adspbtw">
          <form action="#" enctype="multipart/form-data">
            <label for="fileTag" style={{ cursor: "pointer" }}>
              <AttachFileRoundedIcon />
            </label>
            <input
              id="fileTag"
              type="file"
              style={{ display: "none" }}
              onChange={(e) => {
                const val = e.target.files[0];
                setFile(val);
              }}
            />

            <input
              id="sender"
              type="text"
              style={{ display: "none" }}
              value={senderId}
              onChange={(e) => {
                // const val = e.target.files[0];
              }}
            />

            <input
              id="receiver"
              type="text"
              style={{ display: "none" }}
              value={receiverId}
              onChange={(e) => {
                // const val = e.target.files[0];
              }}
            />
          </form>
        </div>
        <div style={{ width: "20%", minWidth: "20%" }}>
          <MyButton
            title="Send"
            id="3"
            handleClick={handleCreate}
            tooltip=""
            handleSchedule={handleSchduled}
          />
        </div>
      </div>
    </div>
  );
};

export default memo(Input);
