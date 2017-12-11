document.addEventListener("DOMContentLoaded", function() {
    function indexViewModel() {
        this.nicotineBase = ko.observable(100);
        this.targetNicotine = ko.observable(3);
        this.batchSize = ko.observable(10);

        this.resultNicotineSolutionML = ko.computed(function() {
            return parseFloat(this.targetNicotine() / this.nicotineBase() * this.batchSize()).toFixed(2);
        }, this);

        this.resultNicotineSolutionPercent = ko.computed(function() {
            return parseFloat(this.resultNicotineSolutionML() / this.batchSize() * 100).toFixed(2);
        }, this);

        this.resultVGML = ko.computed(function() {
            return parseFloat(this.batchSize() - (this.targetNicotine() / this.nicotineBase() * this.batchSize())).toFixed(2);
        }, this);

        this.resultVGPercent = ko.computed(function() {
            return parseFloat(this.resultVGML() / this.batchSize() * 100).toFixed(2);
        }, this);
    };

    ko.applyBindings(indexViewModel);    
});
