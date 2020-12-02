const user = {
  retrieveById: `SELECT username, image FROM user WHERE id = ?;`,
};

const video = {
  retrieveByUser: `SELECT * FROM video WHERE editor = ?;`,
  create: `INSERT INTO video(editor, name, video, audio) VALUES (?, ?, ?, ?);`,
  deleteById: `DELETE FROM video WHERE id = ?;`,
};

const query = {
  user,
  video,
};

export default query;
