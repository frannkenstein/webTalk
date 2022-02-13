import { memo } from "react";

import "./ChatHeader.scss";
import PhoneIcon from "@mui/icons-material/Phone";
import AttachFileRoundedIcon from "@mui/icons-material/AttachFileRounded";

import MoreVertIcon from "@mui/icons-material/MoreVert";
import VideoCallOutlinedIcon from "@mui/icons-material/VideoCallOutlined";
import SearchInput from "../SearchInput/SearchInput";
import Users from "../Users/Users";
const ChatHeader = ({ profile, detail, show, videoCalling, audioCalling }) => {
  return (
    <div className="chatHeader flex-row justify-between align-center">
      <Users userName={detail} image={profile} />

      <div className="headerContent flex-row">
        <SearchInput />
        <PhoneIcon
          className="iconParent flex-column adjust"
          onClick={audioCalling}
          style={{ color: "#a71b1b" }}
        />
        <VideoCallOutlinedIcon
          className="iconParent flex-column adjust"
          onClick={videoCalling}
        />
        <MoreVertIcon className="iconParent flex-column adjust" />
      </div>
    </div>
  );
};

export default memo(ChatHeader);
