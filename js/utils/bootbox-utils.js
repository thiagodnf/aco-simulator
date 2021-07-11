class BootBoxUtils {

    static setDefaults() {

        bootbox.setDefaults({
            backdrop: null,
            closeButton: false,
            swapButtonOrder: true,
            animate: false,
            size: "small",
            centerVertical: true,
        });

        bootstrap.callback = function (value, resolve, reject) {
            if (value) {
                resolve(value);
            } else {
                reject(value);
            }
        }
    }

    static promptNumber(title, min = 1, max = 20, value=2) {

        BootBoxUtils.setDefaults();

        return new Promise((resolve, reject) => {
            bootbox.prompt({
                title: title,
                inputType: "number",
                required: true,
                min: min,
                max: max,
                value: value,
                buttons: {
                    cancel: {
                        label: 'Cancel',
                        className: 'btn-light'
                    }
                },
                callback: (result) => bootstrap.callback(result, resolve, reject)
            });

            $(".bootbox-input").after(`<div class="form-text mt-2">Min: ${min} and Max: ${max}</div>`)
        });
    }

    static alert(message, title) {

        BootBoxUtils.setDefaults();

        return new Promise((resolve, reject) => {
            bootbox.alert({
                message: message,
                title: title,
                callback: (result) => bootstrap.callback(result, resolve, reject)
            });
        });
    }

    static confirm(message) {

        BootBoxUtils.setDefaults();

        return new Promise((resolve, reject) => {
            bootbox.confirm({
                title: "Please Confirm",
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
                callback: (result) => bootstrap.callback(result, resolve, reject)
            });
        });
    }
}
