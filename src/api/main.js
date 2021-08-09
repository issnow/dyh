import axios from 'axios';
// import {nanoid} from 'nanoid';
import {temporaryKey} from "@api/product";


// 下载
export const download = async (url, title) => {
    // const id = nanoid();

    const num = url.lastIndexOf("/") + 1;
    const ext = url.slice(url.lastIndexOf('.'));
    const fileName = title + ext;

    // onfire.fire('download:begin', {id, fileName});


    url = url.replace(/\\/g, "/");

    const {element} = await temporaryKey();

    const obsClient = new ObsClient({
        security_token: element.data.securitytoken,
        access_key_id: element.data.access,
        secret_access_key: element.data.secret,
        server: "https://obs.cn-east-3.myhuaweicloud.com",
    });

    obsClient.getObject({
        Bucket: "yingpu",
        Key: url.split("obs.cn-east-3.myhuaweicloud.com/")[1],
        // ResponseContentDisposition: 'attachment;file=1.jpg',
        ResponseContentType: 'application/octet-stream',
        SaveByType: "file",

    }, function (err, result) {

        const href = result.InterfaceResult.Content.SignedUrl;
        const downloadElement = document.createElement('a');
        downloadElement.href = href;
        // downloadElement.download = 'aaa.gif';
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
    });

    // const result = await axios.get(url, {
    //     withCredentials: false,
    //     headers: {
    //         "Content-Type": 'application/octet-stream',
    //     },
    //     responseType: 'blob',
    //     onDownloadProgress: (progressEvent) => {
    //         const progress = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
    //         onfire.fire('download:progress', {id, fileName, progress});
    //     },
    //
    // }).catch(() => {
    //     onfire.fire('download:error', {id, fileName});
    // });

    // if (result && result.data) {
    //     const blob = new Blob([result.data]);
    //     const href = window.webkitURL.createObjectURL(blob);
    //     const downloadElement = document.createElement('a');
    //     downloadElement.href = href;
    //     downloadElement.download = `${fileName}`;
    //     document.body.appendChild(downloadElement);
    //     downloadElement.click();
    //     document.body.removeChild(downloadElement);
    //     window.URL.revokeObjectURL(href);
    //     onfire.fire('download:success', {id, fileName});
    //
    // }

};
