import { requestPOST } from '@/api';

const VIDEO_BASE_URL = '/video';

const videoAPI = {
  upload: (formData: FormData) =>
    requestPOST(VIDEO_BASE_URL, formData, {}, true),
};

export default videoAPI;
