# LeetCode 3737: Count Subarrays With Majority Element I

**Problem Link:** https://leetcode.com/problems/count-subarrays-with-majority-element-i

---

## 1. Problem Summary

You are given:

- An integer array `nums`
- An integer `target`

You need to return the number of subarrays of `nums` where `target` is the **majority element**.

A **majority element** in a subarray is an element that appears **strictly more than half** of the length of that subarray.

In other words, for a subarray:

```txt
count(target) > subarray.length / 2
```

To avoid decimal comparison, this can be rewritten as:

```txt
2 * count(target) > subarray.length
```

---

## 2. What Is a Subarray?

A subarray is a continuous part of the original array.

For example, given:

```ts
nums = [1, 2, 2, 3]
```

Valid subarrays include:

```txt
[1]
[2]
[2]
[3]
[1, 2]
[2, 2]
[2, 3]
[1, 2, 2]
[2, 2, 3]
[1, 2, 2, 3]
```

But something like this is **not** a subarray:

```txt
[1, 2, 3]
```

if it skips an element from the original array.

---

## 3. Input and Output

### Input

```ts
nums: number[]
target: number
```

Example:

```ts
nums = [1, 2, 2, 3]
target = 2
```

### Output

A single number representing how many subarrays have `target` as the majority element.

Example output:

```ts
5
```

---

## 4. Key Condition

The main condition is:

```txt
2 * targetCount > length
```

Where:

- `targetCount` = number of times `target` appears in the current subarray
- `length` = length of the current subarray

This is equivalent to:

```txt
targetCount > length / 2
```

But it avoids dealing with decimals.

---

## 5. Why Strict Majority Matters

Majority means **more than half**, not equal to half.

Example:

```ts
nums = [2, 1]
target = 2
```

Subarray:

```txt
[2, 1]
```

Here:

```txt
targetCount = 1
length = 2
```

Checking:

```txt
2 * targetCount > length
2 * 1 > 2
2 > 2
```

This is false.

So `[2, 1]` is **not** valid because `2` appears exactly half the time, not more than half.

---

## 6. Example 1 Walkthrough

### Input

```ts
nums = [1, 2, 2, 3]
target = 2
```

### Valid Subarrays

```txt
[2]
[2]
[2, 2]
[1, 2, 2]
[2, 2, 3]
```

So the answer is:

```txt
5
```

---

## 7. Real-World Software Engineering Analogy

Imagine you are working on a SaaS analytics dashboard that tracks event types:

```txt
["billing", "auth", "auth", "analytics"]
```

Suppose you want to count every continuous time window where `"auth"` events are the majority.

A window is valid only if more than half of the events in that window are `"auth"`.

This type of logic can appear in:

- Analytics pipelines
- Log stream analysis
- Fraud detection windows
- Queue/event processing
- Monitoring dashboards
- User activity segmentation

The LeetCode problem is essentially asking:

> Across all possible continuous windows, how many windows are dominated by one specific value?

---

## 8. Hidden Edge Cases

### Edge Case 1: `target` Does Not Appear

```ts
nums = [1, 2, 3]
target = 4
```

Since `4` never appears, no subarray can have `4` as the majority element.

Answer:

```txt
0
```

---

### Edge Case 2: All Elements Are Target

```ts
nums = [1, 1, 1, 1]
target = 1
```

Every subarray is valid.

Total number of subarrays of an array of length `n` is:

```txt
n * (n + 1) / 2
```

For `n = 4`:

```txt
4 * 5 / 2 = 10
```

Answer:

```txt
10
```

---

### Edge Case 3: Single Element Array

```ts
nums = [5]
target = 5
```

Answer:

```txt
1
```

But:

```ts
nums = [5]
target = 3
```

Answer:

```txt
0
```

---

## 9. What the Constraints Tell Us

The constraint is:

```txt
1 <= nums.length <= 1000
```

This is small enough for an `O(n²)` solution.

The number of subarrays is:

```txt
n * (n + 1) / 2
```

For `n = 1000`:

```txt
1000 * 1001 / 2 = 500500
```

That is about half a million subarrays, which is manageable in TypeScript/JavaScript.

So the intended solution for this version is likely:

```txt
Nested loops + running target count
```

---

## 10. Brute Force Thinking

The most naive brute force idea is:

1. Generate every possible subarray.
2. Count how many times `target` appears in that subarray.
3. Check if `target` appears more than half the length.

However, recounting the target from scratch for every subarray would be inefficient.

A better brute force approach is:

- Fix a `start` index.
- Expand the `end` index one step at a time.
- Keep a running count of how many times `target` appears.

This avoids repeatedly scanning the same subarray.

---

## 11. Main Insight

For each fixed `start`, as `end` moves forward, we can maintain:

```ts
let targetCount = 0;
```

Whenever the newly added element is equal to `target`, we increment `targetCount`:

```ts
if (nums[end] === target) {
    targetCount++;
}
```

Then we calculate the current subarray length:

```ts
const length = end - start + 1;
```

And check:

```ts
if (2 * targetCount > length) {
    answer++;
}
```

---

## 12. Pseudocode

```txt
answer = 0

for start from 0 to n - 1:
    targetCount = 0

    for end from start to n - 1:
        if nums[end] == target:
            targetCount++

        length = end - start + 1

        if 2 * targetCount > length:
            answer++

return answer
```

---

## 13. Flowchart-Style Explanation

```txt
Start
  |
  v
Set answer = 0
  |
  v
Pick a start index
  |
  v
Set targetCount = 0
  |
  v
Expand end index one by one
  |
  v
Is nums[end] equal to target?
  |                 |
 yes               no
  |                 |
targetCount++       keep same
  |
  v
Calculate current length
  |
  v
Is 2 * targetCount > length?
  |                 |
 yes               no
  |                 |
answer++            do nothing
  |
  v
Continue expanding
  |
  v
After all starts processed, return answer
```

---

## 14. Detailed Dry Run

### Input

```ts
nums = [1, 2, 2, 3]
target = 2
```

Initial:

```txt
answer = 0
```

---

### Start Index `0`

Subarrays starting at index `0`:

#### `[1]`

```txt
targetCount = 0
length = 1
2 * 0 > 1 => false
```

Invalid.

```txt
answer = 0
```

#### `[1, 2]`

```txt
targetCount = 1
length = 2
2 * 1 > 2 => false
```

Invalid.

```txt
answer = 0
```

#### `[1, 2, 2]`

```txt
targetCount = 2
length = 3
2 * 2 > 3 => true
```

Valid.

```txt
answer = 1
```

#### `[1, 2, 2, 3]`

```txt
targetCount = 2
length = 4
2 * 2 > 4 => false
```

Invalid.

```txt
answer = 1
```

---

### Start Index `1`

Reset:

```txt
targetCount = 0
```

Subarrays starting at index `1`:

#### `[2]`

```txt
targetCount = 1
length = 1
2 * 1 > 1 => true
```

Valid.

```txt
answer = 2
```

#### `[2, 2]`

```txt
targetCount = 2
length = 2
2 * 2 > 2 => true
```

Valid.

```txt
answer = 3
```

#### `[2, 2, 3]`

```txt
targetCount = 2
length = 3
2 * 2 > 3 => true
```

Valid.

```txt
answer = 4
```

---

### Start Index `2`

Reset:

```txt
targetCount = 0
```

Subarrays starting at index `2`:

#### `[2]`

```txt
targetCount = 1
length = 1
2 * 1 > 1 => true
```

Valid.

```txt
answer = 5
```

#### `[2, 3]`

```txt
targetCount = 1
length = 2
2 * 1 > 2 => false
```

Invalid.

```txt
answer = 5
```

---

### Start Index `3`

Reset:

```txt
targetCount = 0
```

Subarray starting at index `3`:

#### `[3]`

```txt
targetCount = 0
length = 1
2 * 0 > 1 => false
```

Invalid.

```txt
answer = 5
```

---

## 15. Compact Trace Table

| Start | End | Subarray | targetCount | Length | Check | Valid? | Answer |
|---:|---:|---|---:|---:|---|---|---:|
| 0 | 0 | `[1]` | 0 | 1 | `0 > 1` | No | 0 |
| 0 | 1 | `[1,2]` | 1 | 2 | `2 > 2` | No | 0 |
| 0 | 2 | `[1,2,2]` | 2 | 3 | `4 > 3` | Yes | 1 |
| 0 | 3 | `[1,2,2,3]` | 2 | 4 | `4 > 4` | No | 1 |
| 1 | 1 | `[2]` | 1 | 1 | `2 > 1` | Yes | 2 |
| 1 | 2 | `[2,2]` | 2 | 2 | `4 > 2` | Yes | 3 |
| 1 | 3 | `[2,2,3]` | 2 | 3 | `4 > 3` | Yes | 4 |
| 2 | 2 | `[2]` | 1 | 1 | `2 > 1` | Yes | 5 |
| 2 | 3 | `[2,3]` | 1 | 2 | `2 > 2` | No | 5 |
| 3 | 3 | `[3]` | 0 | 1 | `0 > 1` | No | 5 |

Final answer:

```txt
5
```

---

## 16. Accepted TypeScript Solution

```ts
function countMajoritySubarrays(nums: number[], target: number): number {
    const n = nums.length;
    let answer = 0;

    for (let start = 0; start < n; start++) {
        let targetCount = 0;

        for (let end = start; end < n; end++) {
            if (nums[end] === target) {
                targetCount++;
            }

            const length = end - start + 1;

            if (2 * targetCount > length) {
                answer++;
            }
        }
    }

    return answer;
}
```

---

## 17. Explanation of Important Variables

### `n`

```ts
const n = nums.length;
```

Stores the length of the array.

---

### `answer`

```ts
let answer = 0;
```

Stores the total count of valid subarrays.

---

### `start`

```ts
for (let start = 0; start < n; start++)
```

Represents the starting index of the current subarray.

---

### `end`

```ts
for (let end = start; end < n; end++)
```

Represents the ending index of the current subarray.

---

### `targetCount`

```ts
let targetCount = 0;
```

Stores how many times `target` appears in the current subarray.

It is reset for every new `start` index.

---

### `length`

```ts
const length = end - start + 1;
```

Stores the length of the current subarray.

---

## 18. Complexity Analysis

### Time Complexity

```txt
O(n²)
```

There are `O(n²)` possible subarrays.

For each subarray, we do only `O(1)` work because we maintain `targetCount` incrementally.

Since `n <= 1000`, this is efficient enough.

---

### Space Complexity

```txt
O(1)
```

We only use a few variables and no extra data structure that grows with input size.

---

## 19. Common Mistakes to Avoid

### Mistake 1: Using `>=` Instead of `>`

Incorrect:

```ts
if (2 * targetCount >= length) {
    answer++;
}
```

This is wrong because majority must be strictly more than half.

Correct:

```ts
if (2 * targetCount > length) {
    answer++;
}
```

---

### Mistake 2: Recounting the Target Every Time

Avoid doing this:

```txt
For every subarray, loop again through the entire subarray to count target.
```

That can become `O(n³)`.

Instead, update `targetCount` as the window expands.

---

### Mistake 3: Thinking Large `nums[i]` Values Matter

The constraint:

```txt
1 <= nums[i] <= 10^9
```

looks large, but it does not affect the algorithm much because we only compare:

```ts
nums[end] === target
```

The important constraint is:

```txt
nums.length <= 1000
```

That tells us `O(n²)` is acceptable.

---

## 20. Extra Insight: Prefix Sum Transformation

A more advanced way to think about this problem is to transform the array:

```txt
target     => +1
non-target => -1
```

Example:

```ts
nums = [1, 2, 2, 3]
target = 2
```

Transformed array:

```txt
[-1, +1, +1, -1]
```

Now, a subarray has `target` as the majority element when the transformed subarray sum is positive.

Why?

- `+1` means one vote for `target`
- `-1` means one vote against `target`
- Positive sum means target has more votes than non-target values

So the problem can also be seen as:

```txt
Count subarrays with sum > 0
```

For this version of the problem, we do not need the advanced solution because `n <= 1000`.

But if `n` were much larger, like `100000`, an `O(n²)` solution would be too slow. Then we would need techniques such as:

- Prefix sums
- Merge sort counting
- Fenwick tree / Binary Indexed Tree

---

## 21. Final Learning Takeaway

The most important lesson from this problem is:

```txt
Do not recompute what you can maintain incrementally.
```

For every fixed `start`, we move `end` forward one step at a time and maintain `targetCount` as a running value.

This turns the approach from a slow repeated-counting brute force into a clean `O(n²)` solution.

