class RouletteWheel extends AntSelection {

    doSelection(probability, sum = 1.0) {

        let j = 0;

        let p = probability[j];

        let r = RandomUtils.nextFloat(0.0, sum);

        while (p < r) {
            j = j + 1;
            p = p + probability[j];
        }

        if (j >= probability.length) {
            j = probability.length - 1;
        }

        return j;
    }
}
