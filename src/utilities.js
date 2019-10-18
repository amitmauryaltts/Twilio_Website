export default {
    debounce(callBackFunction, time) {
        let timeout;
        return function () {
            const args = arguments;
            const functionCall = () => callBackFunction.apply(this, args);
            clearTimeout(timeout);
            timeout = setTimeout(functionCall, time);
        };
    },

    isEmpty(obj) {
        for(var key in obj) {
            if (obj.hasOwnProperty(key))
                return false;
        }
        return true;
    },

    addEllpisis(item, noChar) {
        if (item.length > (noChar-3)) {
            return (item.substring(0, (noChar-3))+'...')
        }
        return item;
    },

    getBase64FromFile (file, fileSize) {
        let typeObject = {
            fileExtension: null,
            file: null,
            contentType: null
        }
        if (!fileSize) {
            fileSize = 2000000;
        }
        return new Promise((resolve, reject) => {
            if (file.size <= fileSize) {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => {
                    let readerResult = reader.result;
                    let contentType = readerResult.substring(5, readerResult.indexOf(";base64,"));
                    let encoded = reader.result.replace(/^data:(.*;base64,)?/, '');
                    if ((encoded.length % 4) > 0) {
                        encoded += '='.repeat(4 - (encoded.length % 4));
                    }
                    typeObject.fileExtension = file.name.split('.').pop();
                    typeObject.file = encoded;
                    typeObject.contentType = contentType;

                    resolve(typeObject);
                };
                reader.onerror = error => reject(error);
            } else {
                reject(`File size is more than ${fileSize} bytes`);
            }
        });
    },

    async getImageFile(fileURL, apiService) {
        if (fileURL && apiService) {
            let key = fileURL.split(".com/")[1];
            try {
                let response =  await apiService.getFile(key);
                let contentType = response.data.contentType;
                let base64Encoded = response.data.data;
                if (contentType && base64Encoded) {
                    return `data:${contentType};base64,${base64Encoded}`;
                }
            } catch (error) {
                return null;
            }
        }
        return null;
    },

    async downloadFile(fileURL, apiService, downloadLink) {
        if (fileURL && apiService && downloadLink) {
            let key = fileURL.split(".com/")[1];
            try {
                let response =  await apiService.getFile(key);
                let contentType = response.data.contentType;
                let base64Encoded = response.data.data;
                let file = `data:${contentType};base64,${base64Encoded}`;

                downloadLink.href = file;
                downloadLink.click();
                return {success: true, error: null};
            } catch (error) {
                return {success: false, error: error.response.data};
            }
        }
        return {success: false, error: null};
    },
}
