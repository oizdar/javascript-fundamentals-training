'use strict';

(function(window, $, Routing, Swal) {
    class RepLogApp {
        constructor($wrapper) {
            this.$wrapper = $wrapper;
            this.helper = new Helper($wrapper)

            this.loadRepLogs();

            this.$wrapper.on(
                'click',
                '.js-delete-rep-log',
                this.handleRepLogDelete.bind(this)
            );

            this.$wrapper.on(
                'click',
                'tbody tr',
                this.handleRowClick.bind(this)
            );

            this.$wrapper.on(
                'submit',
                RepLogApp._selectors.newRepForm,
                this.handleNewFormSubmit.bind(this)
            );
        }

        static get _selectors() {
            return {
                newRepForm: '.js-new-rep-log-form'
            }
        }

        loadRepLogs() {
            $.ajax({
                url: Routing.generate('rep_log_list'),
            }).then((data) => {
                $.each(data.items, (key, repLog) => {
                    this._addRow(repLog)
                });
            });
        }

        handleRepLogDelete(e) {
            e.preventDefault()
            const $link = $(e.currentTarget);
            Swal.fire({
                title: 'Delete this log?',
                text: "What? Did you not actually lift this?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!',
                showLoaderOnConfirm: true,
                preConfirm: () => this._deleteRepLog($link)
            }).then((result) => {
                if (result.isDismissed) {
                    console.log('canceled', result.dismiss)
                }
            })
        }

        _deleteRepLog($link) {
            $link.addClass('text-danger')
            $link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin')
            const deleteUrl = $link.data('url');
            const $row = $link.closest('tr')
            return $.ajax({
                url: deleteUrl,
                method: 'DELETE',
            }).then(() => {
                $row.fadeOut('normal', () => {
                    $row.remove()
                    this.updateTotalWeightLifted()
                });
            })
        }

        updateTotalWeightLifted() {
            this.$wrapper.find('.js-total-weight').html(
                this.helper.getTotalWeightString()
            )
        }

        handleRowClick() {
            console.log('row clicked');
        }

        handleNewFormSubmit(e) {
            e.preventDefault();

            const $form = $(e.currentTarget);
            const formData = {};
            $.each($form.serializeArray(), (key, fieldData) => {
                formData[fieldData.name] = fieldData.value;
            })

            this._saveRepLog(formData)
                .then((data) => {
                    this._clearForm()
                    this._addRow(data)
                }).catch((errorData) => {
                    this._mapErrorsToForm(errorData.errors)
                });
        }

        _mapErrorsToForm(errorData) {
            const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
            this._removeFormErrors();

            $form.find(':input').each((index, element) => {
                const fieldName = $(element).attr('name');
                const $wrapper = $(element).closest('.form-group');
                if(!errorData[fieldName]) {
                    // no error!
                    return;
                }

                const $error = $('<span class="js-field-error help-block"></span>');
                $error.html(errorData[fieldName]);
                $wrapper.append($error)
                $wrapper.addClass('has-error');
            });
        }

        _removeFormErrors() {
            const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
            $form.find('.js-field-error').remove()
            $form.find('.form-group').removeClass('has-error')
        }

        _clearForm() {
            this._removeFormErrors()

            const $form = this.$wrapper.find(RepLogApp._selectors.newRepForm);
            $form[0].reset();
        }

        _addRow(repLog) {

            const html = rowTemplate(repLog)

            this.$wrapper.find('tbody')
                .append($.parseHTML(html))

            this.updateTotalWeightLifted()
        }

        _saveRepLog(data) {
            return new Promise(function (resolve, reject) {
                const url = Routing.generate('rep_log_new');
                $.ajax({
                    url,
                    method: 'POST',
                    data: JSON.stringify(data),
                }).then(function (data, textStatus, jqXHR) {
                    $.ajax({
                        url: jqXHR.getResponseHeader('location')
                    }).then(function (data) {
                        resolve(data)
                    });
                }).catch(function (jqXHR) {
                    const errorData = JSON.parse(jqXHR.responseText)
                    reject(errorData)
                })
            });
        }
    }

    /**
     * A "private" object
     */
    class Helper {
        constructor($wrapper) {
            this.$wrapper = $wrapper;
        }

        calculateTotalWeight() {
            return Helper._calculateWeight(this.$wrapper.find('tbody tr'))
        }

        getTotalWeightString(maxWeight = 500) {
            let weight = this.calculateTotalWeight();
            if(weight > maxWeight) {
                weight = maxWeight + '+'
            }
            return weight + ' lbs'
        }

        static _calculateWeight($elements) {
            let totalWeight = 0;
            $elements.each((index, element) => {
                totalWeight += $(element).data('weight');
            });

            return totalWeight;
        }
    }


    const rowTemplate = (repLog) => `
        <tr data-weight="${repLog.totalWeightLifted}">
            <td>${repLog.itemLabel}</td>
            <td>${repLog.reps}</td>
            <td>${repLog.totalWeightLifted}</td>
            <td>
                &nbsp;<a href="#" class="js-delete-rep-log"
                         data-url="${repLog.links._self}"><span
                            class="fa fa-trash"></span></a>
            </td>
        </tr>
    `

    window.RepLogApp = RepLogApp
})(window, jQuery, Routing, Swal);


