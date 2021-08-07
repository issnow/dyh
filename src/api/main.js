import axios from 'axios';
import {nanoid} from 'nanoid';


// 下载
export const download = async (url, title) => {
    const id = nanoid();

    const num = url.lastIndexOf("/") + 1;
    const ext = url.slice(url.lastIndexOf('.'));
    const fileName = title + ext;

    onfire.fire('download:begin', {id, fileName});


    url = url.replace(/\\/g, "/");
    const result = await axios.get(url, {
        withCredentials: false,
        headers: {
            "Content-Type": 'application/octet-stream',
        },
        responseType: 'blob',
        onDownloadProgress: (progressEvent) => {
            const progress = Math.floor((progressEvent.loaded / progressEvent.total) * 100);
            onfire.fire('download:progress', {id, fileName, progress});
        },

    }).catch(() => {
        onfire.fire('download:error', {id, fileName});
    });

    if (result && result.data) {
        const blob = new Blob([result.data]);
        const href = window.webkitURL.createObjectURL(blob);
        const downloadElement = document.createElement('a');
        downloadElement.href = href;
        downloadElement.download = `${fileName}`;
        document.body.appendChild(downloadElement);
        downloadElement.click();
        document.body.removeChild(downloadElement);
        window.URL.revokeObjectURL(href);
        onfire.fire('download:success', {id, fileName});

    }

};
