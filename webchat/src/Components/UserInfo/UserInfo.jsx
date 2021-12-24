import { memo } from "react";
import "./UserInfo.scss";
import { Avatar } from "@material-ui/core";

const UserInfo = ({ detail }) => {
  return (
    <div className="userDetails flex-row font-family">
      <Avatar alt="Aakash Singh" src={localStorage.getItem("userImage")} />
      <span>{detail}</span>
    </div>
  );
};

export default memo(UserInfo);
