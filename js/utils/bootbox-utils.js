class BootBoxUtils {

    static setDefaults() {

    }

    static promptNumber(title, min=1, max=20) {

        BootBoxUtils.setDefaults();

        return new Promise((resolve, reject) => {
            bootbox.prompt({
                title: title,
                centerVertical: true,
                size: "small",
                swapButtonOrder: true,
                closeButton: false,
                animate: false,
                inputType: "number",
                required: true,
                min: min,
                max: max,
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

            $(".bootbox-input").after(`<div class="form-text mt-2">Min: ${min}, Max: ${max}</div>`)
        });
    }


    static alert(message) {

        BootBoxUtils.setDefaults();

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

        BootBoxUtils.setDefaults();

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
