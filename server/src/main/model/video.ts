import connection from './config';
import query from './query';

export const retrieveByUser = async (id: number) => {
  const videoList = await connection.query(query.video.retrieveByUser, [id]);
  return videoList;
};

export default retrieveByUser;
