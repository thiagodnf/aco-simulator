class FileUtils {

    static parseContent(content, hasHeader) {

        var data = [];

        content.split("\n").forEach((rows, i) => {

            if (hasHeader && i == 0) {
                return;
            }

            let array = rows.split(",").map(e => parseFloat(e));

            data.push({
                x: array[0],
                y: array[1],
            });
        });

        return data;
    }

    static readCSV(file, hasHeader, callback) {

        var fileReader = new FileReader();

        fileReader.onload = function (e) {

            var content = e.target.result;

            let data = FileUtils.parseContent(content, hasHeader);

            callback && callback(data);
        }

        fileReader.readAsText(file);
    }

    static export(data, fileName) {

        // Building the CSV from the Data two-dimensional array
        // Each column is separated by ";" and new line "\n" for next row
        var csvContent = '';

        data.forEach(function (infoArray, index) {
            let dataString = infoArray.map(e => e.toString()).join(',');
            csvContent += index < data.length ? dataString + '\n' : dataString;
        });

        let mimeType = 'text/csv;encoding:utf-8';

        var a = document.createElement('a');
        mimeType = mimeType || 'application/octet-stream';


        // for UTF-16
        var cCode, bArr = [];
        bArr.push(255, 254);
        for (var i = 0; i < csvContent.length; ++i) {
            cCode = csvContent.charCodeAt(i);
            bArr.push(cCode & 0xff);
            bArr.push(cCode / 256 >>> 0);
        }

        var blob = new Blob([new Uint8Array(bArr)], { type: 'text/csv;charset=UTF-16LE;' });

        if (navigator.msSaveBlob) {
            navigator.msSaveBlob(blob, fileName);
        } else {
            var link = document.createElement("a");
            if (link.download !== undefined) {
                var url = window.URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", fileName);
                link.style.visibility = 'hidden';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);

            }
        }



        // if (navigator.msSaveBlob) { // IE10
        //     navigator.msSaveBlob(new Blob([csvContent], {
        //         type: mimeType
        //     }), fileName);
        // } else if (URL && 'download' in a) { //html5 A[download]
        //     a.href = URL.createObjectURL(new Blob([csvContent], {
        //         type: mimeType
        //     }));
        //     a.setAttribute('download', fileName);
        //     document.body.appendChild(a);
        //     a.click();
        //     document.body.removeChild(a);
        // } else {
        //     location.href = 'data:application/octet-stream,' + encodeURIComponent(csvContent); // only this mime type is supported
        // }


        // var download = document.getElementById('download');
        // download.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
        // download.setAttribute('download', 'test.csv');
    }
}
