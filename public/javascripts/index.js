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
        this.recipeName = ko.observable("");

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

        // Options
        this.saveRecipe = function saveRecipe() {
            var xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = function () {
                if (this.readyState == XMLHttpRequest.DONE) {
                    if (this.status >= 200 && this.status < 300) {
                        var response = JSON.parse(this.responseText);

                        if (response.posted) {
                            window.location.pathname = '/recipes/' + response.id;
                        } else {
                            // TODO: Invalid request
                        }
                    } else {
                        // TODO: Invalid request
                    }
                }
            };

            var tmpFlavors = [];

            for (var i = 0; i < this.flavors().length; i++) {
                tmpFlavors.push({
                    name: this.flavors()[i].name(),
                    percent: this.flavors()[i].percent()
                });
            }

            xhttp.open("POST", "/recipes/add", true);
            xhttp.setRequestHeader("Content-Type", "application/json");
            xhttp.send(JSON.stringify({
                recipeName: this.recipeName(),
                nicotineBase: this.nicotineBase(),
                targetNicotine: this.targetNicotine(),
                vgRatio: this.vgRatio(),
                batchSize: this.batchSize(),
                flavors: tmpFlavors
            }));
        }.bind(this);

        this.resetRecipe = function resetRecipe() {
            this.recipeName("");
            this.nicotineBase(100);
            this.targetNicotine(3);
            this.batchSize(10);
            this.vgRatio(70);
            this.flavors([]);
            flavorIndex = 1;
        }.bind(this);
    };

    ko.applyBindings(indexViewModel);
});
