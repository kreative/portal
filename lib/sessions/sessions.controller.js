const Sessions = require("./sessions");
const s = new Sessions();

exports.postSession = (req, res) => {
  s.createSession(req.body.tag, req.body.description, req.body.ksn)
    .then((session) => res.json({ status: 202, data: session }))
    .catch((error) => res.json({ status: 500, data: error }));
};

exports.getAllSessions = (req, res) => {
  s.getSessions()
    .then((sessions) => res.json({ status: 202, data: sessions }))
    .catch((error) => res.json({ status: 500, data: error }));
};