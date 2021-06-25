class RouletteWheel{

    select(probability, sumProbability=1.0) {

		let j = 0;

		let p = probability[j];

		let r = RandomUtils.nextFloat(0.0, sumProbability);

		while (p < r) {
			j = j + 1;
			p = p + probability[j];
		}

        // if(j >= 12){
            console.log("-----")
            console.log(probability)
            console.log(j)
            console.log(r)
            console.log(p)

        // }

		return j;
	}
}
