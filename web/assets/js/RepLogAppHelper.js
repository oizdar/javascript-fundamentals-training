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

module.exports = Helper;
