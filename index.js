$(document).ready(function () {
    MyForm = {

        getData: function () {
            let inputsArray = $('#MyForm').serializeArray();
            let data = {};
            $.each(inputsArray, function (index, input) {
                return data[input.name] = input.value;
            });
            return data;
        },

        setData: function (data) {
            $.each(data, function (key, value) {
                $('input[name=' + key + ']').val(value);
            });
        },

        validate: function () {
            let isValid = true;
            let errorFields = [];
            let form_object = MyForm.getData();

            if (!validate_fio(form_object)) {
                isValid = false;
                errorFields.push("fio")
            }
            if (!validate_email(form_object)) {
                isValid = false;
                errorFields.push("email")
            }
            if (!validate_phone(form_object)) {
                isValid = false;
                errorFields.push("phone")
            }

            return {isValid, errorFields};


            function validate_fio(form_object) {
                let valid_format = /[\wа-яё]+/gi;
                let count_words = form_object.fio.match(valid_format).length;
                if (count_words === 3) {
                    return true
                }
            }

            function validate_email(form_object) {

                let email_string = form_object.email;
                valid_domains = /ya(ndex)?\.(ru|ua|by|kz|com)$/gi;
                        if (valid_domains.test(email_string)) {
                            return true
                        } else {
                            return false
                        }
                }


            function validate_phone(form_object) {
                let phone_string = form_object.phone;
                let valid_format = /\+7\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}/;
                let number = /[0-9]/gi;

                if (valid_format.test(phone_string)) {
                    let numbers = phone_string.match(number);
                    let result = 0;
                    $.each(numbers, function (index, value) {
                        result = result + parseInt(value);
                    });
                    if (result <= 30) {
                        return true
                    }
                } else {
                    return false
                }
            }
        },

        submit: function () {
            let validationInfo = MyForm.validate();
            if (!validationInfo.isValid) {
                $('input').toggleClass('error', false);
                $.each(validationInfo.errorFields, function (index, field) {
                    $('input[name=' + field + ']').toggleClass('error', true);
                });

            } else {
                $('input').toggleClass('error', false);
                $('#submitButton').prop('disabled', true);
                ;


                $.getJSON('./success.json', function (data) {
                    switch (data.status) {
                        case "success":
                            $('#resultContainer').html("Success.<br>");
                            $('#resultContainer').toggleClass('success', true);
                            break;
                        case "error":
                            $('#resultContainer').html(data.reason);
                            $('#resultContainer').toggleClass('error', true);
                            break;
                        case "progress":
                            setTimeout(MyForm.submit, data.timeout);
                            $('#resultContainer').toggleClass('progress', true);
                            console.log('Progress');
                            break;
                    }
                });
            }
        }
    };

    $("#MyForm").submit(function (event) {
        event.preventDefault();
        MyForm.submit();
        console.log(MyForm.getData());
    });

    MyForm.setData({fio: "Иванов Иван Иванович", email: "email@ya.ru", phone: "+7(000)000-00-00"});
    console.log(MyForm.getData());
});