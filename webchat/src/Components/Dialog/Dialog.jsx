import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import "./Dialog.scss";
import Slide from "@material-ui/core/Slide";
const useStyles = makeStyles((theme) => ({
  dialog: {
    position: "relative",
    width: "100%",
  },
  profileDialog: {
    position: "relative",
    height: "none",
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const WDialog = ({ show, children, height, heading, minWidth, maxWidth }) => {
  return (
    <Dialog
      open={show}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          minWidth: minWidth ?? "36%",
          maxWidth: maxWidth ?? "36%",
          height: height ?? "30%",
          padding: "1%",
        },
      }}
    >
      {heading && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {heading}
        </div>
      )}
      {children}
    </Dialog>
  );
};

export default WDialog;
