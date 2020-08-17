const generate = require("../../utils/Generate");

class Sessions {

  createSession(tag, description, ksn) {
    const createdat = Date.now();

    return new Promise((resolve, reject) => {
      generate.sessionID((session_id) => {
        SessionModel.create({
          session_id,
          ksn,
          tag,
          description,
          createdat
        })
          .then((session) => resolve(session))
          .catch((error) => reject(error ));
      });
    });
  };

  getSessions() {
    return new Promise((resolve, reject) => {
      SessionModel.findAll()
        .then((sessions) => resolve(sessions))
        .catch((error) => reject(error));
    });
  };
}

module.exports = Sessions;