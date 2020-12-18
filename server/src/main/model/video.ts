import { OkPacket, RowDataPacket } from 'mysql2';
import connection from './config';
import query from './query';

export const retrieveByUser = async (id: number) => {
  const videos = (await connection.query(query.video.retrieveByUser, [id]))[0];
  return videos;
};

export const upsert = async (editor: number, name: string, video: string) => {
  const result = ((await connection.query(
    query.video.retrieveByName,
    name
  )) as RowDataPacket[][])[0][0];

  if (result) {
    await connection.query(query.video.update, [video, new Date(), result.id]);
    return result.id;
  }
  return ((
    await connection.query(query.video.create, [editor, name, video])
  )[0] as OkPacket).insertId;
};
