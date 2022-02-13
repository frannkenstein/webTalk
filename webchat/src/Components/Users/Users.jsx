import { useSelector } from "react-redux";
import Avatar from "@mui/material/Avatar";
import { memo } from "react";

const Users = ({
  sender,
  userName,
  friendId,
  image,
  onClick,
  dashBoard,
  socket,
  k,
}) => {
  const user = useSelector((state) => state.showOnlineUsers);

  // const newMessages = useSelector((state) => state.newMessages);

  // const [pop, setpop] = useState({ ids: [] });
  // const [r, setr] = useState("");

  // useEffect(() => {
  //   setpop({ ids: newMessages.ids });
  // }, [newMessages]);
  return (
    <div
      key={`key__${k}`}
      className="list flex-row"
      style={{ alignItems: "center" }}
      onClick={onClick}
    >
      <Avatar key={`key__${k}`} alt="Aakash Singh" src={image} />

      <li className="chatName flex-column font-h4 font-600">{userName}</li>

      {user?.users && user?.users?.some((user) => user?.userId === friendId) ? (
        <span className="onLineTag"></span>
      ) : (
        <span className="offLineTag"></span>
      )}

      {/* {pop.ids.includes(r) && (
        <span className="newMessage flex-column adjust">1</span>
      )} */}
    </div>
  );
};

export default memo(Users);
// async function userRoomId() {
//   console.log("here");
//   try {
//     let res = await friendsList(sender, friendId);
//     res.data.length && setr(res.data[0]._id);

//     dispatch(
//       setUserRoomID({ friendId: friendId, userRoomId: res.data[0]._id })
//     );
//   } catch (e) {
//     console.log(e);
//   }
// }
