import { requestGET, requestPOST } from '@/api';
import axios from 'axios';

const VIDEO_BASE_URL = '/video';

const videoAPI = {
  upload: (formData: FormData) =>
    requestPOST(VIDEO_BASE_URL, formData, {}, true),
  getList: () => requestGET(`${VIDEO_BASE_URL}/list`),
  download: url =>
    axios.get(url, {
      responseType: 'arraybuffer',
    }),
};

export default videoAPI;
