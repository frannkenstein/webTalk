import conversation from "../../models/conversation.js";

export const chatList = async (req, res) => {
  const roomId = req.params.id;

  try {
    const data = await conversation.find({ roomId });

    res.status(200).json(data);
  } catch (err) {
    res.status(500).send(err);
    console.log(err);
  }
};
