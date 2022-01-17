import "./Input.scss";

const Input = ({ id, value, onChange }) => {
  return (
    <div className="customField flex-row align-center">
      {id === "1" && (
        <div className="input flex-row align-center">
          <img
            src="https://img.icons8.com/ios-glyphs/30/000000/user.png"
            alt=""
          />
          <input
            type="text"
            placeholder="Username"
            value={value}
            onChange={onChange}
          />
        </div>
      )}

      {id === "2" && (
        <div className="input flex-row align-center">
          <img
            src="https://img.icons8.com/ios-glyphs/30/000000/lock--v2.png"
            alt=""
          />
          <input
            type="password"
            placeholder="Password"
            value={value}
            onChange={onChange}
          />
        </div>
      )}

      {id === "3" && (
        <div className="input flex-row align-center">
          <input
            type="text"
            placeholder="Group Name"
            value={value}
            onChange={onChange}
          />
        </div>
      )}
    </div>
  );
};

export default Input;
