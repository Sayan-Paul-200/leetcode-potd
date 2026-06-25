function countMajoritySubarrays(nums: number[], target: number): number {

    const n = nums.length
    let answer = 0

    for (let start=0; start<n; start++) {
        let targetCount = 0

        for (let end=start; end<n; end++) {
            if (nums[end] === target) targetCount++

            const length = end - start + 1

            if (2*targetCount > length) answer ++
        }
    }

    return answer

};