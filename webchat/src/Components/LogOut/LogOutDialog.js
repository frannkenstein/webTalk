import React from "react";
import WDialog from "../Dialog/Dialog";
import MyButton from "../InputComponents/MyButton";

const LogOutDialog = ({ show, Done, setShow }) => {
  return (
    <WDialog
      show={show}
      height="30%"
      heading={
        <span
          style={{
            fontSize: "2rem",
            paddingTop: "4%",
            paddingBottom: "4%",
          }}
        >
          Logout?
        </span>
      }
    >
      <div
        className="flex-column"
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: "92%",
        }}
      >
        <div
          className="flex-row"
          style={{
            width: "100%",
            justifyContent: "space-around",
            alignItems: "center",
          }}
        >
          <MyButton
            title="Yes"
            id="2"
            handleClick={() => {
              Done();
            }}
            tooltip="Yes"
          />

          <MyButton
            title="No"
            id="1"
            handleClick={(e) => {
              setShow(false);
            }}
            tooltip="No"
          />
        </div>
      </div>
    </WDialog>
  );
};

export default LogOutDialog;
