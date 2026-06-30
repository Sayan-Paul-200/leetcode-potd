function numOfStrings(patterns: string[], word: string): number {
    let count = 0;

    for (const pattern of patterns) {
        if (word.includes(pattern)) {
            count++;
        }
    }

    return count;
}