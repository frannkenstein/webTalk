import "./MyButton.scss";
import { memo } from "react";
import { ReactComponent as Arrow } from "../../Assets/schedule.svg";
import Tippy from "@tippyjs/react/headless";
import "tippy.js/dist/tippy.css";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";

const Box = styled(animated.div)`
  background: #333;
  color: white;
  padding: 5px 10px;
  border-radius: 4px;
`;
const MyButton = ({ title, id, handleClick, tooltip, handleSchedule }) => {
  const config = { tension: 300, friction: 15 };
  const initialStyles = { opacity: 0, transform: "scale(0.5)" };
  const [props, setSpring] = useSpring(() => initialStyles);
  function onMount() {
    setSpring({
      opacity: 1,
      transform: "scale(1)",
      onRest: () => {},
      config,
    });
  }

  function onHide({ unmount }) {
    setSpring({
      ...initialStyles,
      onRest: unmount,
      config: { ...config, clamp: true },
    });
  }
  return (
    <>
      {(id === "1" || id === "2") && (
        <Tippy
          render={(attrs) => (
            <Box style={props} {...attrs}>
              {tooltip}
            </Box>
          )}
          animation={true}
          onMount={onMount}
          onHide={onHide}
        >
          {/* <Tippy content={<span>{tooltip}</span>}> */}
          <button
            className={`myButton ${id === "1" ? " oneButton" : " twoButton"}`}
            onClick={handleClick}
          >
            {title}
          </button>
        </Tippy>
      )}
      {id === "3" && (
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <span onClick={handleClick} className="scheduleAndSend">
            Send
          </span>

          <span className="line"></span>
          <Tippy
            render={(attrs) => (
              <Box style={props} {...attrs}>
                Schedule
              </Box>
            )}
            animation={true}
            onMount={onMount}
            onHide={onHide}
          >
            <Arrow
              onClick={handleSchedule}
              className="arrow"
              width="28px"
              style={{ cursor: "pointer" }}
            />
          </Tippy>
        </div>
      )}
    </>
  );
};

export default memo(MyButton);
