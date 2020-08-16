const Sessions = require("./session.controller");
const generate = require("../../utils/Generate");

class Sessions {

  createSession(tag, description, ksn) {
    const createdat = Date.now();

    generate.sessionID((session_id) => {
      Sessions.create({
        session_id,
        ksn,
        tag,
        description,
        createdat
      })
        .then((session) => {
          return { status: 202, data: session };
        })
        .catch((error) => {
          return { status: 500, data: error };
        });
    });
  }

  getSessions() {
    Sessions.findAll()
      .then((sessions) => {
        return { status: 202, data: sessions };
      })
      .catch((error) => {
        console.log(error);
        return { status: 500, data: error };
      })
  }

}

module.exports = Sessions;