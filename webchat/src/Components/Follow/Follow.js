import React, { useEffect, useState } from "react";
import { addFriends, friendsList } from "../../api/api";
import follow from "../../Assets/follow.png";
import followed from "../../Assets/followed.png";
import { useDispatch } from "react-redux";

const Follow = ({ roomId, sender, friendId, socket }) => {
  const [follows, setFollow] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    console.log(sender, friendId);
    // socket.current.on("addingFriend", (data) => {
    //   data.roomId && setFollow(true);
    // });
  }, [sender, friendId]);

  const handleRequest = async () => {
    console.log(sender, friendId);
    try {
      const result = await addFriends({ sender, friendId });
      if (result) {
        console.log(result.data._id);
        setFollow(true);
        let data = {
          sender,
          friendId,
          roomId: result.data._id,
        };
        socket.current.emit("friendship", data);
        // window.location.reload();
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {roomId || follows ? (
        <img src={followed} alt="" />
      ) : (
        <img src={follow} alt="" onClick={!roomId && handleRequest} />
      )}
    </>
  );
};

export default React.memo(Follow);
