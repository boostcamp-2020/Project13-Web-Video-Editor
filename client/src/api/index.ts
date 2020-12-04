import axios from 'axios';
import handleError from '@/utils/error';

const BASE_URL =
  process.env.NODE_ENV === 'production'
    ? 'https://boostwave.ga/api'
    : 'http://127.0.0.1:3000';

const getInstance = (isFileOperation: boolean) =>
  axios.create({
    baseURL: BASE_URL,
    timeout: isFileOperation ? 300_000 : 10_000,
    headers: {
      Authorization: localStorage.getItem('token'),
    },
  });

export const requestGET = async (
  url: string,
  params: object = {},
  headers: object = {},
  isFileOperation: boolean = false
) => {
  try {
    return await getInstance(isFileOperation).get(url, { params, headers });
  } catch (err) {
    return handleError(err);
  }
};

export const requestPOST = async (
  url: string,
  data: object = {},
  headers: object = {},
  isFileOperation: boolean = false
) => {
  try {
    return await getInstance(isFileOperation).post(url, data, headers);
  } catch (err) {
    return handleError(err);
  }
};

export const requestPUT = async (
  url: string,
  data: object = {},
  headers: object = {}
) => {
  try {
    return await getInstance(false).put(url, data, headers);
  } catch (err) {
    return handleError(err);
  }
};

export const requestPATCH = async (
  url: string,
  data: object = {},
  headers: object = {}
) => {
  try {
    return await getInstance(false).patch(url, data, headers);
  } catch (err) {
    return handleError(err);
  }
};

export const requestDELETE = async (
  url: string,
  params: object = {},
  headers: object = {}
) => {
  try {
    return await getInstance(false).delete(url, { params, headers });
  } catch (err) {
    return handleError(err);
  }
};
