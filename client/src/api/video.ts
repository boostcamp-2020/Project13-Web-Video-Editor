import { requestGET, requestPOST } from '@/api';

const VIDEO_BASE_URL = '/video';

const videoAPI = {
  upload: (formData: FormData) =>
    requestPOST(VIDEO_BASE_URL, formData, {}, true),
  getList: () => requestGET(`${VIDEO_BASE_URL}/list`),
};

export default videoAPI;
