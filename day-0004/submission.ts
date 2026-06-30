function maximumElementAfterDecrementingAndRearranging(arr: number[]): number {
    arr.sort((a, b) => a - b);

    let answer = 0;

    for (const num of arr) {
        if (num > answer) {
            answer++;
        }
    }

    return answer;
};