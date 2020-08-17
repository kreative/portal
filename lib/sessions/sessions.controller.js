const Sessions = require("./sessions");
const sessions = new Sessions();

exports.createSession = (req, res) => {
  sessions.createSession(req.body.tag, req.body.description, req.body.ksn)
    .then((session) => res.json({ status: 202, data: session }))
    .catch((error) => res.json({ status: 500, data: error }));
};

exports.getSessions = (req, res) => {
  sessions.getSessions()
    .then((sessions) => res.json({ status: 202, data: sessions }))
    .catch((error) => res.json({ status: 500, data: error }));
};