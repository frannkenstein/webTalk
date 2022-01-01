import { useDispatch, useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
import { memo, useEffect, useState } from "react";
import { friendsList } from "../../api/api";
import { setUserRoomID } from "../../Redux/actions/userRoomId";
const Users = ({ sender, userName, friendId, image, key, onClick }) => {
  const user = useSelector((state) => state.showOnlineUsers);
  const newMessages = useSelector((state) => state.newMessages);

  const dispatch = useDispatch();
  const [pop, setpop] = useState({ ids: [] });
  const [r, setr] = useState("");

  async function userRoomId() {
    try {
      let res = await friendsList(sender, friendId);

      res.data.length && setr(res.data[0]._id);

      dispatch(
        setUserRoomID({ friendId: friendId, userRoomId: res.data[0]._id })
      );
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    sender && friendId && userRoomId();
  }, []);

  useEffect(() => {
    setpop({ ids: newMessages.ids });
  }, [newMessages]);
  return (
    <div
      key={key}
      className="list flex-row"
      style={{ alignItems: "center" }}
      onClick={onClick}
    >
      <Avatar alt="Aakash Singh" src={image} />

      <li className="chatName flex-column font-h4 font-600">{userName}</li>

      {user?.users && user?.users?.some((user) => user?.userId === friendId) ? (
        <span className="onLineTag"></span>
      ) : (
        <span className="offLineTag"></span>
      )}

      {pop.ids.includes(r) && (
        <span className="newMessage flex-column adjust">1</span>
      )}
    </div>
  );
};

export default memo(Users);
