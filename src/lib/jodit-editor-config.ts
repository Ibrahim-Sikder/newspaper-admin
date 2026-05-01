/* eslint-disable @typescript-eslint/no-explicit-any */

export const joditConfig = {
  uploader: {
    url: `${process.env.NEXT_PUBLIC_BASE_API_URL}/uploads`,
    format: 'json',
    prepareData: function (data: any) {
      return data;
    },
    isSuccess: (resp: any) => !resp.error,
    process: (resp: any) => {
      return {
        files: resp.data && resp.data.location ? [resp.data.location] : [],
        path: resp.data && resp.data.location,
        error: resp.error,
        msg: resp.msg,
      };
    },
  },
  height: 500,
  toolbarAdaptive: false, 
  spellcheck: false, 
  disablePlugins: ['speechRecognition'], 
};
