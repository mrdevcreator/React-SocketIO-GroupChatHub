const Message = ({ message }) => (
  <div
    className={`${message.sender === "user" ? "text-right" : "text-left"} mb-2`}
  >
    <span
      className={`${
        message.sender === "user"
          ? "bg-blue-400 text-white"
          : "bg-gray-300 text-black"
      } px-4 py-2 rounded-lg inline-block`}
    >
      {message.text}
    </span>
    <span
      className={`${
        message.sender === "user" ? "pr-1" : "pl-1"
      } block text-xs text-gray-500`}
    >
      {message.sender === "user" ? "me" : `${message.sender}`}
    </span>
  </div>
);

import PropTypes from "prop-types";

Message.propTypes = {
  message: PropTypes.shape({
    sender: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
  }).isRequired,
};

export default Message;
