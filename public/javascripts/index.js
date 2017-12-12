document.addEventListener("DOMContentLoaded", function() {
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
        this.ml = ko.computed(function() {
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

        //Flavorings
        this.flavors = ko.observableArray([]);

        this.noFlavors = ko.computed(function() {
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
        this.resultNicotineSolutionML = ko.computed(function() {
            return parsePrecision(this.targetNicotine() / this.nicotineBase() * this.batchSize());
        }, this);

        this.resultNicotineSolutionPercent = ko.computed(function() {
            return parsePrecision(this.resultNicotineSolutionML() / this.batchSize() * 100);
        }, this);

        this.resultVGML = ko.computed(function() {
            return parsePrecision(this.batchSize() - this.resultNicotineSolutionML() - this.totalFlavorML());
        }, this);

        this.resultVGPercent = ko.computed(function() {
            return parsePrecision(this.resultVGML() / this.batchSize() * 100);
        }, this);

        this.resultFlavorsML = ko.computed(function() {
            return parsePrecision(this.totalFlavorML());
        })

        this.resultFlavorsPercent = ko.computed(function() {
            return parsePrecision(this.totalFlavorPercent());
        })
    };

    ko.applyBindings(indexViewModel);    
});
