class RouletteWheel extends AntSelection {

    doSelection(probability, sum) {

        let j = 0;

        let p = probability[j];

        let r = RandomUtils.nextFloat(0.0, sum, 15);

        while (p < r) {
            j = j + 1;
            p = p + probability[j];
        }

        return j;
    }
}
