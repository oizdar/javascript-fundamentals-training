'use strict';

(function(window, $) {
    window.RepLogApp = function ($wrapper) {
        this.$wrapper = $wrapper;
        this.helper = new Helper($wrapper)

        this.$wrapper.find('.js-delete-rep-log').on(
            'click',
            this.handleRepLogDelete.bind(this)
        );

        this.$wrapper.find('tbody tr').on(
            'click',
            this.handleRowClick.bind(this)
        )

        console.log(this.helper, Object.keys(this.helper));
        console.log(Helper, Object.keys(Helper));
        console.log(this.helper.calculateTotalWeight());
    };

    $.extend(window.RepLogApp.prototype, {
        handleRepLogDelete: function (e) {
            e.preventDefault()
            let $link = $(e.currentTarget);
            $link.addClass('text-danger')
            $link.find('.fa')
                .removeClass('fa-trash')
                .addClass('fa-spinner')
                .addClass('fa-spin')
            let deleteUrl = $link.data('url');
            let $row = $link.closest('tr')
            let self = this;
            $.ajax({
                url: deleteUrl,
                method: 'DELETE',
                success: function () {
                    $row.fadeOut('normal', function () {
                        $(this).remove()
                        self.updateTotalWeightLifted()
                    });
                }
            })
        },

        updateTotalWeightLifted: function () {
            this.$wrapper.find('.js-total-weight').html(
                this.helper.calculateTotalWeight()
            )
        },

        handleRowClick: function () {
            console.log('row clicked');
        },
    })

    /**
     * A "private" object
     */
    let Helper = function ($wrapper) {
        this.$wrapper = $wrapper;
    };

    $.extend(Helper.prototype, {
        calculateTotalWeight: function () {
            let totalWeight = 0;
            this.$wrapper.find('tbody tr').each(function () {
                totalWeight += $(this).data('weight');
            });

            return totalWeight;
        }
    });

})(window, jQuery);


