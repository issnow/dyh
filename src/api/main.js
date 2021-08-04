import axios from './request';


// 下载
export const download = (url, title) => {
    return new Promise((resolve, reject) => {
        url = url.replace(/\\/g, "/");
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        // xhr.onprogress = res => {
        //   let percent = ((res.loaded / res.total) * 100).toFixed(0);
        // }
        xhr.onload = () => {
            if (xhr.status === 200) {
                // 获取文件blob数据并保存
                // var num = url.lastIndexOf("/") + 1;
                //把参数和文件名分割开
                // var fileName = url.substring(num).split("?")[0];
                var ext = url.slice(url.lastIndexOf('.'));
                var export_blob = new Blob([xhr.response]);
                var save_link = document.createElementNS(
                    "http://www.w3.org/1999/xhtml",
                    "a",
                );
                save_link.href = URL.createObjectURL(export_blob);
                save_link.download = title + ext;
                save_link.click();
                resolve();
            }
        };
        xhr.send();
    });

};
