'use strict';

(function(window, $, Routing, Swal) {
    let HelperInstances = new WeakMap();

    class RepLogApp {

        constructor($wrapper) {
            this.$wrapper = $wrapper;
            this.repLogs = [];
            HelperInstances.set(this, new Helper(this.repLogs))

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
                for (let repLog of data.items) {
                    this._addRow(repLog)
                }
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
                    this.repLogs.splice(
                        $row.data('key'),
                        1
                    );
                    $row.remove()
                    this.updateTotalWeightLifted()
                });
            })
        }

        updateTotalWeightLifted() {
            this.$wrapper.find('.js-total-weight').html(
                HelperInstances.get(this).getTotalWeightString()
            )
        }

        handleRowClick() {
            console.log('row clicked');
        }

        handleNewFormSubmit(e) {
            e.preventDefault();

            const $form = $(e.currentTarget);
            const formData = {};
            for (let fieldData of $form.serializeArray()) {
                formData[fieldData.name] = fieldData.value;
            }

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

            for (let element of $form.find(':input')) {
                const fieldName = $(element).attr('name');
                const $wrapper = $(element).closest('.form-group');
                if(!errorData[fieldName]) {
                    // no error!
                    continue;
                }

                const $error = $('<span class="js-field-error help-block"></span>');
                $error.html(errorData[fieldName]);
                $wrapper.append($error)
                $wrapper.addClass('has-error');
            }
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
            this.repLogs.push(repLog);
            const html = rowTemplate(repLog);
            const $row = $($.parseHTML(html));
            $row.data('key', this.repLogs.length - 1)
            this.$wrapper.find('tbody')
                .append($row)
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
        constructor(repLogs) {
            this.repLogs = repLogs;
        }

        calculateTotalWeight() {
            return Helper._calculateWeight(this.repLogs)
        }

        getTotalWeightString(maxWeight = 500) {
            let weight = this.calculateTotalWeight();
            if(weight > maxWeight) {
                weight = maxWeight + '+'
            }
            return weight + ' lbs'
        }

        static _calculateWeight(repLogs) {
            let totalWeight = 0;
            for (let repLog of repLogs) {
                totalWeight += repLog.totalWeightLifted;
            }

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


