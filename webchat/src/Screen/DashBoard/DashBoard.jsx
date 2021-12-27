import { useState, useEffect, useRef, memo } from "react";

import { friendsList, userDetails } from "../../api/api";
import { loadUsers } from "../../Redux/actions/usersAction.js";
import { String } from "../../Constants/String";
import { userDetail } from "../../Redux/actions/friendDetails";
import { loadOnlineUsers } from "../../Redux/actions/onlineActions";
import "./DashBoard.scss";
import { addMessage } from "../../Redux/actions/messageActions";
import Users from "../../Components/Users/Users";
import { loadNewMessage } from "../../Redux/actions/newMessageAction";

import loadable from "@loadable/component";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import MyButton from "../../Components/InputComponents/MyButton";
import Follow from "../../Components/Follow/Follow";
import { socketActions } from "../../Redux/actions/socketActions";

const Chat = loadable(() => import("../../Components/Chat/Chat"));
const Wait = loadable(() => import("../../Components/Wait/Wait"), {
  fallback: <></>,
});

const UserInfo = loadable(() => import("../../Components/UserInfo/UserInfo"), {
  fallback: <></>,
});

const DashBoard = () => {
  const { users } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const [user, setuser] = useState();
  const userIdLocal = localStorage.getItem("userId");
  const [loading, setLoading] = useState(false);
  const [senderId, setsenderId] = useState("");
  const [receiverId, setreceiverId] = useState("");
  const [profile, setProfile] = useState(null);
  const [chatId, setRoomChatId] = useState(null);

  const socket = useRef();

  async function load() {
    setLoading(true);
    let data = await userDetails();

    dispatch(loadUsers(data.data));
    setLoading(false);
  }

  useEffect(() => {
    setuser(users[0]);
  }, [users]);

  useEffect(() => {
    load();
    socket.current = io("ws://localhost:3002");

    dispatch(socketActions(socket.current));

    socket.current.on("getMessage", (data) => {
      let messageData = {
        time: data.time,
        senderId: data.senderId,
        receiverId: data.receiverId,
        messageId: data.messageId,
        referenceId: data.referenceId,
        replied: data.replied,
        roomId: data.roomId,
        message: {
          message: data.message,
          read: data.read,
          attachments: data.attachments,
        },
      };

      if (messageData.roomId === localStorage.getItem("roomId")) {
        dispatch(
          addMessage({ message: messageData, roomId: messageData.roomId })
        );
      } else {
        dispatch(loadNewMessage({ roomId: messageData.roomId }));
      }
    });

    socket.current.on("getUsers", (data) => {
      dispatch(loadOnlineUsers(data));
    });

    return () => {
      socket.current.close();
    };
  }, []);

  useEffect(() => {
    socket.current.emit("addUser", localStorage.getItem("userId"));
  }, [userIdLocal]);

  const handleChat = async (j, image) => {
    try {
      let result = await friendsList(
        user[j]._id,
        localStorage.getItem("userId")
      );

      if (result.data.length && !(result.data[0]._id === chatId)) {
        localStorage.setItem("roomId", result.data[0]._id);

        chatId &&
          setRoomChatId((prevState) => {
            return "";
          });

        setRoomChatId((prevState) => {
          return result.data[0]._id;
        });
        localStorage.setItem("chatId", result.data[0]._id);

        setreceiverId(user[j]._id);

        setsenderId(localStorage.getItem("userId"));
        setProfile(image);
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleClick = () => {};

  return (
    <>
      {loading ? (
        <Wait />
      ) : (
        <>
          <div className="dashboard flex-column font-family">
            <span className="logo flex-row adjust">WebChat</span>
            <UserInfo detail={localStorage.getItem("userName")} />

            <div className="dm adspbtw font-h2 font-600">{String.CHAT}</div>
            <div className="userList flex-column">
              {users[0] &&
                users[0].map((user, i) => {
                  let friendId = user._id;
                  let userId = localStorage.getItem("userId");

                  return (
                    !(friendId === userId) && (
                      <div
                        className="list flex-row"
                        onClick={() => {
                          dispatch(userDetail(user.username));

                          handleChat(i, user.image);
                        }}
                        key={user._id}
                      >
                        <Users
                          sender={userId}
                          userName={user.username}
                          friendId={friendId}
                          image={user.image}
                          key={user._id}
                        />
                      </div>
                    )
                  );
                })}
            </div>
            <div style={{ bottom: "0", position: "absolute", width: "100%" }}>
              <MyButton
                title="Logout"
                id="2"
                handleClick={handleClick}
                tooltip="Logout"
              />
            </div>
          </div>

          {chatId && (
            <Chat
              chatId={chatId}
              profile={profile}
              socket={socket}
              sender={senderId}
              receiver={receiverId}
            />
          )}
        </>
      )}
    </>
  );
};

export default memo(DashBoard);
