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
// import Follow from "../../Components/Follow/Follow";
import { socketActions } from "../../Redux/actions/socketActions";
import { logOutAction } from "../../Redux/actions/dialogActions";

const Chat = loadable(() => import("../../Components/Chat/Chat"));
const Wait = loadable(() => import("../../Components/Wait/Wait"), {
  fallback: <></>,
});

const UserInfo = loadable(() => import("../../Components/UserInfo/UserInfo"), {
  fallback: <></>,
});

const DashBoard = () => {
  const { users } = useSelector((state) => state.users);
  const userRoomIdReducer = useSelector((state) => state.userRoomIdReducer);

  const dispatch = useDispatch();

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
    Notification.requestPermission().then((res) => console.log(res));
    load();
    socket.current = io("ws://localhost:3001");

    dispatch(socketActions(socket.current));
    socket.current.on("connect", () => {
      console.log(socket.id);
    });
    socket.current.on("getMessage", (data) => {
      console.log(data);
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
    let friendIds = users[j]._id;
    let roomId = userRoomIdReducer[friendIds];

    setRoomChatId(roomId);

    localStorage.setItem("roomId", roomId);
    localStorage.setItem("chatId", roomId);

    setreceiverId(friendIds);
    setsenderId(localStorage.getItem("userId"));
    setProfile(image);
  };

  const handleClick = () => {
    dispatch(logOutAction(true));
  };

  return (
    <>
      {loading ? (
        <Wait />
      ) : (
        <>
          <div className="dashboard flex-column font-family" id="dashboard">
            <span className="logo flex-row adjust">WebChat</span>
            <UserInfo detail={localStorage.getItem("userName")} />

            <div className="dm adspbtw font-h2 font-600">{String.CHAT}</div>
            <div className="userList flex-column">
              {users &&
                users.map((user, i) => {
                  let friendId = user._id;
                  let userId = localStorage.getItem("userId");

                  return (
                    !(friendId === userId) && (
                      <Users
                        onClick={() => {
                          dispatch(userDetail(user.username));
                          handleChat(i, user.image);
                        }}
                        sender={userId}
                        userName={user.username}
                        friendId={friendId}
                        image={user.image}
                        key={user._id}
                      />
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
