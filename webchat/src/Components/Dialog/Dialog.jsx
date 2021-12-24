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
const WDialog = ({ show, children, height, heading }) => {
  return (
    <Dialog
      open={show}
      TransitionComponent={Transition}
      PaperProps={{
        style: {
          minWidth: "350px",
          maxWidth: "400px",
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
