import { useRef, useState, useEffect, memo, useCallback } from "react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { useSelector, useDispatch } from "react-redux";

import "./Chat.scss";
import "../../Styles/style.scss";
import ChatHeader from "../ChatHeader/ChatHeader";
import { create, chatList, upload } from "../../api/api";
import Message from "../Message/Message";
import Input from "../Input/Input";
import { addMessage, loadMesages } from "../../Redux/actions/messageActions";
import Intro from "../Intro/Intro";
import Cross from "../Cross/Cross";
import { clearReply } from "../../Redux/actions/loadReplyAction";
import PhotoViewer from "../PhotoViewer/PhotoViewer";
const Chat = ({ chatId, profile, socket, sender, receiver }) => {
  const messages = useSelector((state) => state.messages);
  const { friendDetail } = useSelector((state) => state.friendDetails);
  const { users } = useSelector((state) => state.showOnlineUsers);
  const { replyMessage } = useSelector((state) => state.loadReply);

  const dispatch = useDispatch();

  const [file, setFile] = useState("");
  const [mess, setMess] = useState([]);
  const [text, setText] = useState("");
  const scrollRefArray = useRef();
  const [scrolled, setScrolled] = useState("");
  const [unique, setUniqueId] = useState("");

  async function friendsID() {
    let data = await chatList(localStorage.getItem("roomId") ?? chatId);
    dispatch(
      loadMesages({
        messages: data.data,
        roomId: chatId,
      })
    );
    setUniqueId(chatId);
  }
  useEffect(() => {
    console.log("mount");
    friendsID();

    return () => {
      console.log("Unmounted");
    };
  }, []);

  useEffect(() => {
    setText("");
    setFile("");
    messages && setMess(messages[chatId]);
  }, [messages, chatId]);

  const handleCreate = async (e) => {
    e.preventDefault();

    replyMessage?.messageId && dispatch(clearReply());
    let id = Date.now();
    let messageData = {
      scheduleTime: null,
      time: id,
      senderId: sender,
      receiverId: receiver,
      messageId: id,

      roomId: unique,
      referenceId: replyMessage ? replyMessage?.messageId : null,
      message: {
        message: null,
        replied: replyMessage ? replyMessage.message.message : null,
        read: false,
        attachments: replyMessage ? 1 : null,
      },
    };
    if (text) {
      try {
        messageData.message.message = text;
        let res = await create(messageData);

        dispatch(addMessage({ message: messageData, roomId: unique }));

        users &&
          users?.some((user) => user?.userId === receiver) &&
          socket.current.emit("sendmessage", {
            time: id,
            senderId: sender,
            receiverId: receiver,
            messageId: id,
            message: text,
            referenceId: replyMessage ? replyMessage?.messageId : null,
            replied: replyMessage ? replyMessage.message.message : null,
            read: false,
            attachments: replyMessage ? 1 : null,
            roomId: unique,
          });
      } catch (err) {
        console.log(err.message, "Fail to send message");
        return;
      }

      setText("");
      dispatch(clearReply());
    }
    if (file) {
      messageData.message.message = file;
      let convert = JSON.stringify(messageData);
      let data = new FormData();
      data.append("file", file);
      data.append("messageData", convert);

      let result = await upload(data);
      if (result.status === 201) {
        let message = result.data.path;

        dispatch(
          addMessage({
            message: {
              time: id,
              senderId: sender,
              receiverId: receiver,
              messageId: id,
              roomId: unique,
              referenceId: replyMessage ? replyMessage?.messageId : null,

              message: {
                message: message,
                replied: replyMessage ? replyMessage.message.message : null,
                read: false,
                attachments: replyMessage ? 1 : null,
              },
            },

            roomId: unique,
          })
        );

        users &&
          users?.some((user) => user?.userId === receiver) &&
          socket.current.emit("sendmessage", {
            time: id,
            senderId: sender,
            receiverId: receiver,
            messageId: id,
            message: message,
            referenceId: replyMessage ? replyMessage?.messageId : null,
            replied: replyMessage ? replyMessage.message.message : null,
            read: false,
            attachments: replyMessage ? 1 : null,
            roomId: unique,
          });
      }

      setFile("");
    }
  };
  const handleSchduled = async (e) => {
    e.preventDefault();

    let id = Date.now();

    let scheduleTime = 30;

    if (text) {
      let messageData = {
        scheduleTime: scheduleTime,
        time: id,
        senderId: sender,
        receiverId: receiver,
        messageId: id,

        roomId: unique,
        referenceId: replyMessage ? replyMessage?.messageId : null,
        message: {
          message: text,
          replied: replyMessage ? replyMessage.message.message : null,
          read: false,
          attachments: replyMessage ? 1 : null,
        },
      };
      try {
        let res = await create(messageData);
        if (res.status === 200) {
          setText("");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };
  const handleScroll = useCallback((i) => {
    setScrolled((scrolled) => (scrolled = i));

    let domElement = document.getElementById(i);
    domElement.scrollIntoView({ block: "start", behavior: "smooth" });
  }, []);

  const handleCrossIcon = () => {
    dispatch(clearReply());
  };

  return (
    <div className="chatReply flex-row">
      <PhotoViewer {...{ file, setFile, handleCreate }} />
      <div className="chat flex-column font-family">
        <ChatHeader profile={profile} detail={friendDetail} show={true} />

        <div className="chatSection flex-column">
          <div className="chatStart flex-column">
            <Intro {...{ profile, sender, receiver, friendDetail }} />
            {mess ? (
              mess.map((m, i) => {
                return (
                  <div
                    className={
                      "messageSpan flex-column" +
                      (m.messageId === scrolled ? " scrolled" : null)
                    }
                    id={m.messageId}
                    onClick={() => m.referenceId && handleScroll(m.referenceId)}
                  >
                    {
                      <Message
                        visible={
                          !(i > 0 && mess[i - 1].senderId === mess[i].senderId)
                        }
                        userName={friendDetail}
                        message={m}
                        image={profile}
                        attachments={m.message.attachments}
                        sender={m.senderId}
                        receiver={m.receiverId}
                        key={m.messageId}
                        ref={scrollRefArray}
                      />
                    }
                  </div>
                );
              })
            ) : (
              <>
                <Skeleton duration={1} count={5} height={10} width={`100%`} />

                <Skeleton duration={1} count={5} height={10} width={`100%`} />
              </>
            )}
          </div>
          {replyMessage && (
            <div className="replyContainer">
              {replyMessage.message.message}
              <Cross handleCross={handleCrossIcon} />
            </div>
          )}

          <div className="chatInput flex-row adjust">
            <Input
              {...{ text, setText }}
              {...{ handleCreate, handleSchduled }}
              variant="Message"
              receiver={receiver}
              sender={sender}
              {...{ file, setFile }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(Chat);
