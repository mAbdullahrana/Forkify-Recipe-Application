import { async } from 'regenerator-runtime/runtime';
import { Timout_Sec } from './config.js';

const timeout = function (s) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error(`Request took too long! Timeout after ${s} second`));
    }, s * 1000);
  });
};

// export const Get_Json = async function (url) {
//   try {
//     const res = await Promise.race([fetch(url), timeout(Timout_Sec)]);

//     const data = await res.json();

//     if (!res.ok) throw new Error(`${data.message}${res.status}`);
//     return data;
//   } catch (err) {
//     throw err;
//   }
// };
export const AJAX = async function (url, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(url);

    const res = await Promise.race([fetchPro, timeout(Timout_Sec)]);

    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message}${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};
