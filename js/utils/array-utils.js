class ArrayUtils {

    static newMatrix(lines, columns, initialValue = 0) {
        return Array(lines).fill().map(() => Array(columns).fill(initialValue));
    }

    static copyArray(array){
        return [...array];
    }

    static copyMatrix(matrix){

        let copy = [];

        matrix.forEach(row => {
            copy.push([...row]);
        });

        return copy;
    }

    static shuffle(array) {

        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    static minAndMax(matrix) {

        let min = [];
        let max = [];

        for(let i=0;i<matrix.length;i++){
            min.push(Math.min(...matrix[i]));
            max.push(Math.max(...matrix[i]));
        }

        return {
            min: Math.min(...min),
            max: Math.max(...max)
        }
    }
}
