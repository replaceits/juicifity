document.addEventListener("DOMContentLoaded", function () {
    var valuePrecision = 2;

    var parsePrecision = function parseNumberToFloatValueWithSetPrecision(num, precision) {
        return Number(
            parseFloat(num).toFixed(
                (precision == undefined ? valuePrecision : precision)
            )
        );
    }

    var flavorIndex = 1;
    var Flavor = function flavor(batchSize, removeFlavorFromArray) {
        this.batchSize = batchSize;
        this.removeFlavorFromArray = removeFlavorFromArray;

        this.name = ko.observable("");
        this.percent = ko.observable(0);

        this.percentParsed = ko.computed(function () {
            return parsePrecision(this.percent());
        }, this);

        this.ml = ko.computed(function () {
            return parsePrecision(this.batchSize() * this.percent() / 100);
        }, this);

        this.index = "Flavor " + flavorIndex++;

        this.removeFlavor = function removeFlavor() {
            this.removeFlavorFromArray(this);
        }
    }

    var indexViewModel = function indexViewModel() {
        // Base
        this.nicotineBase = ko.observable(100);
        this.targetNicotine = ko.observable(3);
        this.batchSize = ko.observable(10);
        this.vgRatio = ko.observable(70);
        this.pgRatio = ko.computed({
            read: function () {
                return 100 - this.vgRatio();
            },
            write: function (value) {
                this.vgRatio(100 - value);
            }
        }, this);

        //Flavorings
        this.flavors = ko.observableArray([]);

        this.noFlavors = ko.computed(function () {
            return (this.flavors().length == 0 ? true : false);
        }, this);

        this.removeFlavorFromArray = function removeFlavorFromArray(flavor) {
            this.flavors.remove(flavor);
        }.bind(this);

        this.addFlavor = function addFlavor() {
            this.flavors.push(new Flavor(this.batchSize, this.removeFlavorFromArray));
        }

        this.totalFlavorML = ko.computed(function totalFlavorML() {
            var totalML = 0;

            for (var i = 0; i < this.flavors().length; i++) {
                totalML += parseFloat(this.flavors()[i].ml());
            }

            return totalML;
        }, this);

        this.totalFlavorPercent = ko.computed(function totalFlavorML() {
            var totalPercent = 0;

            for (var i = 0; i < this.flavors().length; i++) {
                totalPercent += parseFloat(this.flavors()[i].percent());
            }

            return totalPercent;
        }, this);

        // Results
        this.resultBaseML = ko.computed(function () {
            return parsePrecision(this.batchSize() - this.totalFlavorML());
        }, this);

        this.resultBasePercent = ko.computed(function () {
            return parsePrecision(this.resultBaseML() / this.batchSize() * 100);
        }, this);

        this.resultNicotineSolutionML = ko.computed(function () {
            return parsePrecision(this.targetNicotine() / this.nicotineBase() * this.batchSize());
        }, this);

        this.resultNicotineSolutionPercent = ko.computed(function () {
            return parsePrecision(this.resultNicotineSolutionML() / this.batchSize() * 100);
        }, this);

        this.resultVGML = ko.computed(function () {
            return parsePrecision((this.batchSize() * this.vgRatio() / 100));
        }, this);

        this.resultVGPercent = ko.computed(function () {
            return parsePrecision(this.resultVGML() / this.batchSize() * 100);
        }, this);

        this.resultPGML = ko.computed(function () {
            return parsePrecision((this.batchSize() * this.pgRatio() / 100) - this.resultNicotineSolutionML() - this.totalFlavorML());
        }, this);

        this.resultPGPercent = ko.computed(function () {
            return parsePrecision(this.resultPGML() / this.batchSize() * 100);
        }, this);

        this.resultFlavorsML = ko.computed(function () {
            return parsePrecision(this.totalFlavorML());
        })

        this.resultFlavorsPercent = ko.computed(function () {
            return parsePrecision(this.totalFlavorPercent());
        })
    };

    ko.applyBindings(indexViewModel);
});
