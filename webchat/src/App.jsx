import { signIn, signUp } from "./api/api";
import { Profiler, useCallback, useEffect, useState } from "react";

import loadable from "@loadable/component";

import LogOutDialog from "./Components/LogOut/LogOutDialog";

const Login = loadable(() => import("./Screen/Authentication/Login"), {
  fallback: <></>,
});
const DashBoard = loadable(() => import("./Screen/DashBoard/DashBoard"), {
  fallback: <></>,
});

const App = () => {
  const [login, setlogin] = useState("false");
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [p1, setP1] = useState("");
  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [image, setImage] = useState(null);
  const [show, setShow] = useState(false);
  const [images, setImages] = useState("");

  useEffect(() => {
    if (localStorage.getItem("Login") === "true") {
      setlogin("true");
    } else if (localStorage.getItem("Login") === "false") {
      setlogin("false");
    }
  }, []);

  const handleClick = async (e, i) => {
    e.preventDefault();

    if (i === 0) {
      if (p2 === p3) {
        await signUp({
          username: name,
          password: p2,
          image: image,
        });
      } else {
        alert("Invalid Credentials");
      }
    } else if (i === 1) {
      const data = await signIn({
        username: username,
        password: p1,
      });

      if (data.data.status === "ok") {
        setImages(data.data.user?.image);
        localStorage.setItem("userImage", data.data.user.image);
        localStorage.setItem("Login", "true");
        localStorage.setItem("userName", data.data.user?.username);

        localStorage.setItem("userId", data.data.user?._id);
        localStorage.setItem("conversationId", data.data.user?._id);

        setlogin("true");
      } else {
        alert("Invalid credentials");
        setlogin("false");
      }
    }
  };

  function logout() {
    setShow(true);
  }
  const Done = () => {
    localStorage.removeItem("roomId");
    localStorage.setItem("Login", "false");
    setlogin("false");
    setShow(false);
  };
  function Data(
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) {
    this.id = id;
    this.phase = phase;
    this.actualDuration = actualDuration;
    this.baseDuration = baseDuration;
    this.startTime = startTime;
    this.commitTime = commitTime;
  }

  const onRender = (
    id,
    phase,
    actualDuration,
    baseDuration,
    startTime,
    commitTime
  ) => {
    let tableValue = new Data(
      id,
      phase,
      actualDuration,
      baseDuration,
      startTime,
      commitTime
    );

    // console.table(tableValue);
  };

  return (
    <div className="App flex-row" style={{ minHeight: "100vh" }}>
      {login === "false" ? (
        <Login
          onClick={handleClick}
          {...{ name, setName }}
          {...{ username, setUsername }}
          {...{ p1, setP1 }}
          {...{ p2, setP2 }}
          {...{ p3, setP3 }}
          {...{ image, setImage }}
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "row", width: "100%" }}>
          <Profiler id="app" onRender={onRender}>
            <DashBoard />
          </Profiler>
          <LogOutDialog {...{ show, Done, setShow }} />
        </div>
      )}
    </div>
  );
};

export default App;
