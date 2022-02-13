import { useState } from "react";
import "./Input.scss";
import { memo } from "react";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";
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
    <div className="completeInput flex-column align-center justify-evenly">
      <div className="inputSection flex-row adjust">
        <div
          onClick={() => setShow((val) => !val)}
          style={{ cursor: "pointer" }}
        >
          <ion-icon name="happy-outline"></ion-icon>
        </div>
        {/* <button onClick={() => setShow((val) => !val)}>Helo</button> */}
        {show && (
          <Picker
            onSelect={(emoji) => setText(text + emoji.native)}
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
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              // e.preventDefault();
              handleCreate(e);
            }
          }}
          autoComplete="off"
        />
        <div className="flex-row adspbtw">
          <form action="#" encType="multipart/form-data">
            <label htmlFor="fileTag" style={{ cursor: "pointer" }}>
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
