class BootBoxUtils {

    static setDefaults() {

        bootbox.setDefaults({
            backdrop: true,
            closeButton: false,
            swapButtonOrder: true,
            animate: false,
            size: "small",
            centerVertical: true,
        });
    }

    static promptNumber(title, min = 1, max = 20) {

        BootBoxUtils.setDefaults();

        return new Promise((resolve, reject) => {
            bootbox.prompt({
                title: title,
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

            $(".bootbox-input").after(`<div class="form-text mt-2">Min: ${min} and Max: ${max}</div>`)
        });
    }

    static alert(message) {

        BootBoxUtils.setDefaults();

        return new Promise((resolve, reject) => {
            bootbox.alert({
                message: message,
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
