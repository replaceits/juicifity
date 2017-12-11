document.addEventListener("DOMContentLoaded", function() {
    var valuePrecision = 2;

    var parsePrecision = function parseNumberToFloatValueWithSetPrecision(num, precision) {
        return Number(
            parseFloat(num).toFixed(
                (precision == undefined ? valuePrecision : precision)
            )
        );
    }

    var indexViewModel = function indexViewModel() {
        this.nicotineBase = ko.observable(100);
        this.targetNicotine = ko.observable(3);
        this.batchSize = ko.observable(10);

        this.resultNicotineSolutionML = ko.computed(function() {
            return parsePrecision(this.targetNicotine() / this.nicotineBase() * this.batchSize());
        }, this);

        this.resultNicotineSolutionPercent = ko.computed(function() {
            return parsePrecision(this.resultNicotineSolutionML() / this.batchSize() * 100);
        }, this);

        this.resultVGML = ko.computed(function() {
            return parsePrecision(this.batchSize() - (this.targetNicotine() / this.nicotineBase() * this.batchSize()));
        }, this);

        this.resultVGPercent = ko.computed(function() {
            return parsePrecision(this.resultVGML() / this.batchSize() * 100);
        }, this);
    };

    ko.applyBindings(indexViewModel);    
});
