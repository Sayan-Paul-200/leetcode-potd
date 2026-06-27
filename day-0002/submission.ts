function countMajoritySubarrays(nums: number[], target: number): number {
    
    const n = nums.length
    const offset = n + 1
    const freq: number[] = new Array(2*n + 3).fill(0)

    let cumSum = 0
    let validLeftPoints = 0
    let result = 0

    freq[cumSum + offset] = 1

    for (const num of nums) {
        if (num === target) {
            validLeftPoints += freq[cumSum + offset]
            cumSum += 1
        } else {
            cumSum -= 1
            validLeftPoints -= freq[cumSum + offset]
        }

        result += validLeftPoints

        freq[cumSum + offset] += 1
    }

    return result

};