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

        // let mimeType = 'text/csv;encoding:utf-8';

        // var a = document.createElement('a');
        // mimeType = mimeType || 'application/octet-stream';


        // // for UTF-16
        // var cCode, bArr = [];
        // bArr.push(255, 254);
        // for (var i = 0; i < csvContent.length; ++i) {
        //     cCode = csvContent.charCodeAt(i);
        //     bArr.push(cCode & 0xff);
        //     bArr.push(cCode / 256 >>> 0);
        // }

        console.log(csvContent)

        var blob = new Blob(["o"], { type: "text/plain;charset=utf-8" });

        var a = document.createElement("a");
        document.body.appendChild(a);
        a.style = "display: none";
        a.href = window.URL.createObjectURL(blob);
        a.download = "script.gnu";
        a.click();
    }
}
