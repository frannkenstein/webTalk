import { useSelector } from "react-redux";
import { Avatar } from "@material-ui/core";
import { memo, useEffect, useState } from "react";
import { friendsList } from "../../api/api";
const Users = ({ sender, userName, friendId, image, key }) => {
  const user = useSelector((state) => state.showOnlineUsers);
  const newMessages = useSelector((state) => state.newMessages);

  const [pop, setpop] = useState({ ids: [] });
  const [r, setr] = useState("");

  async function f() {
    try {
      let res = await friendsList(sender, friendId);

      res.data.length && setr(res.data[0]._id);
    } catch (e) {
      console.log(e);
    }
  }
  useEffect(() => {
    sender && friendId && f();
  }, []);

  useEffect(() => {
    setpop({ ids: newMessages.ids });
  }, [newMessages]);
  return (
    <div key={key} className="flex-row">
      <Avatar alt="Aakash Singh" src={image} />

      <div className="nameMessage flex-column">
        <li className="chatName flex-column font-h4 font-600">{userName}</li>
      </div>

      {user?.users &&
        user?.users?.some((user) => user?.userId === friendId) && (
          <span className="onLineTag"></span>
        )}

      {pop.ids.includes(r) && (
        <span className="newMessage flex-column adjust">1</span>
      )}
    </div>
  );
};

export default memo(Users);
