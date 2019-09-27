const randomIndex = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];

function calculateAHP(labels: string[], matrix: number[][]) {
    if (labels.length <= randomIndex.length) {
        if (matrix.length === labels.length && matrix.every(row => row.length === labels.length)) {
            // Priority Vector Generation
            let total: number[] = new Array<number>(labels.length);
            for (let i = 0; i < total.length; i++) {
                total[i] = matrix.map(row => row[i]).reduce((p, c) => p += c);
            }
            let eigenVectors = matrix.map(row => row.map((value, index) => value / total[index]));
            let eigenValues = eigenVectors.map(row => row.reduce((p, c) => p += c));
            let eigenValuesAverage = eigenValues.map(row => row / labels.length);

            // Consistency check
            let lambdaMax = total.map((t, i) => t * eigenValuesAverage[i]).reduce((p, c) => p += c);
            let consistencyIndex = (lambdaMax - labels.length) / (labels.length - 1);
            let consistencyRatio = consistencyIndex / randomIndex[labels.length - 1];

            // Buff the result
            return {
                priorityVector: labels.map((label, index) => ({ label: label, priority: eigenValuesAverage[index] })).sort((a, b) => b.priority - a.priority),
                consistencyRatio: consistencyRatio,
            };
        } else {
            throw new Error('Matrix length mismatch with labels');
        }
    } else {
        throw new Error('Cannot set labels more than 10');
    }
}

const tests = [
    {
        name: 'Criteria',
        labels: ['Personality', 'Experience', 'Subject'],
        matrix: [
            [1, 2, 4],
            [0.5, 1, 2],
            [0.25, 0.5, 1],
        ],
    },
    {
        name: 'Experience',
        labels: ['Ikmal', 'Ashri', 'Ihsan', 'Margaretha', 'Ida'],
        matrix: [
            [1, 5, 5, 1 / 3, 1 / 7],
            [1 / 5, 1, 1, 1 / 7, 1 / 9],
            [1 / 5, 1, 1, 1 / 7, 1 / 7],
            [3, 7, 7, 1, 1 / 2],
            [7, 9, 7, 2, 1],
        ],
    },
    {
        name: 'Subject',
        labels: ['Ikmal', 'Ashri', 'Ihsan', 'Margaretha', 'Ida'],
        matrix: [
            [1, 1 / 2, 1 / 3, 1 / 2, 1 / 4],
            [2, 1, 1 / 4, 1, 1],
            [3, 4, 1, 5, 4],
            [2, 1, 1 / 5, 1, 1],
            [4, 1, 1/4, 1, 1],
        ],
    },
];

tests.forEach((test, i) => {
    console.log(`Test ${i + 1} (${test.name}) =>`, calculateAHP(test.labels, test.matrix));
});
