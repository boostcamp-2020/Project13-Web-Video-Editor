const user = {
  retrieveById: `SELECT username, image FROM user WHERE id = ?;`,
};

const video = {
  retrieveByUser: `SELECT id, name, video, updated_at FROM video WHERE editor = ? ORDER BY updated_at DESC;`,
  retrieveByName: `SELECT id FROM video WHERE name = ?;`,
  create: `INSERT INTO video(editor, name, video) VALUES (?, ?, ?);`,
  update: `UPDATE video SET video = ?, updated_at = ? WHERE id = ?;`,
  deleteById: `DELETE FROM video WHERE id = ?;`,
};

const query = {
  user,
  video,
};

export default query;
