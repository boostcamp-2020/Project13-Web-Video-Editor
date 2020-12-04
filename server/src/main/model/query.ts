const user = {
  retrieveById: `SELECT username, image FROM user WHERE id = ?;`,
};

const video = {
  retrieveByUser: `SELECT id, name, video, updated_at FROM video WHERE editor = ?;`,
  create: `INSERT INTO video(editor, name, video) VALUES (?, ?, ?);`,
  deleteById: `DELETE FROM video WHERE id = ?;`,
};

const query = {
  user,
  video,
};

export default query;
