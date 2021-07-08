class BootBoxUtils {

    static promptNumber(title) {

        return new Promise((resolve, reject) => {
            bootbox.prompt({
                title: title,
                centerVertical: true,
                message: '<p>Please select an option below:</p>',
                size: "small",
                swapButtonOrder: true,
                closeButton: false,
                animate: false,
                inputType: "number",
                required: true,
                min: 1,
                max: canvas.nodesLimit,
                value: 10,
                buttons: {
                    cancel: {
                        label: 'Cancel',
                        className: 'btn-light'
                    }
                },
                callback: function (value) {
                    if (value) {
                        resolve(value);
                    } else {
                        reject(value);
                    }
                }
            });
        });
    }


    static alert(message) {

        return new Promise((resolve, reject) => {
            bootbox.alert({
                message: message,
                centerVertical: true,
                size: "small",
                swapButtonOrder: true,
                closeButton: false,
                animate: false,
                callback: function (result) {
                    if (result) {
                        resolve();
                    } else {
                        reject();
                    }
                }
            });
        });
    }

    static confirm(message) {

        return new Promise((resolve, reject) => {
            bootbox.confirm({
                message: message,
                centerVertical: true,
                size: "small",
                swapButtonOrder: true,
                closeButton: false,
                animate: false,
                buttons: {
                    confirm: {
                        label: 'Yes',
                        className: 'btn-primary'
                    },
                    cancel: {
                        label: 'No',
                        className: 'btn-light'
                    }
                },
                callback: function (result) {
                    if (result) {
                        resolve();
                    } else {
                        reject();
                    }
                }
            });
        });
    }

}
