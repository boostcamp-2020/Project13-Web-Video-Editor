import { OkPacket } from 'mysql2';
import connection from './config';
import query from './query';

export const retrieveByUser = async (id: number) => {
  const videos = (await connection.query(query.video.retrieveByUser, [id]))[0];
  return videos;
};

export const create = async (
  editor: number,
  name: string,
  video: string,
  audio: string
) => {
  const id = ((
    await connection.query(query.video.create, [editor, name, video, audio])
  )[0] as OkPacket).insertId;
  return id;
};

export default retrieveByUser;
