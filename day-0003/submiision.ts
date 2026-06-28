function maximumLength(nums: number[]): number {
    
    const freq = new Map<number, number>()

    for (const num of nums) {
        freq.set(num, (freq.get(num) ?? 0) + 1)
    }

    let answer = 1

    // For [1, 1, 1, ...]
    const ones = freq.get(1) ?? 0
    if (ones > 0) {
        answer = Math.max(answer, (ones%2 === 1) ? ones : ones-1)
    }

    for (const x of freq.keys()) {
        if (x === 1) continue

        let current = x
        let length = 0

        while ((freq.get(current) ?? 0) >= 2) {
            length += 2
            current*= current

            if (current > 1e9) break
        }

        if ((freq.get(current) ?? 0) >= 1) {
            length += 1
        } else {
            length -= 1
        }

        answer = Math.max(answer, length)
    }

    return answer

};