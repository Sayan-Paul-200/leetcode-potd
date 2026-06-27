# LeetCode 3739 — Count Subarrays With Majority Element II

Problem link: https://leetcode.com/problems/count-subarrays-with-majority-element-ii

## Problem Summary

You are given an integer array `nums` and an integer `target`.

You need to return the number of subarrays where `target` is the **majority element**.

A majority element in a subarray is an element that appears **strictly more than half** of the subarray length.

So for a subarray:

```txt
count(target) > length / 2
```

To avoid decimal comparisons, we can write it as:

```txt
2 * count(target) > length
```

## Examples

### Example 1

```txt
Input: nums = [1,2,2,3], target = 2
Output: 5
```

Valid subarrays:

```txt
[2]
[2]
[2,2]
[1,2,2]
[2,2,3]
```

So the answer is `5`.

### Example 2

```txt
Input: nums = [1,1,1,1], target = 1
Output: 10
```

All subarrays are valid because every element is the target.

Total subarrays:

```txt
n * (n + 1) / 2 = 4 * 5 / 2 = 10
```

### Example 3

```txt
Input: nums = [1,2,3], target = 4
Output: 0
```

The target does not appear, so no subarray can have it as the majority element.

## Constraints

```txt
1 <= nums.length <= 100000
1 <= nums[i] <= 10^9
1 <= target <= 10^9
```

The important constraint is:

```txt
nums.length <= 100000
```

This means the `O(n²)` solution from the easier version is too slow.

For `n = 100000`, the total number of subarrays is:

```txt
100000 * 100001 / 2 = 5,000,050,000
```

That is around 5 billion subarrays, which is too many to check one by one.

---

# Core Idea

We convert the array into a score system:

```txt
target     -> +1
non-target -> -1
```

Now every subarray has a score.

If the score is positive, then the target appears more times than all non-target elements combined.

So:

```txt
subarray sum > 0
```

means:

```txt
target is the majority element
```

## Example

```txt
nums   = [1, 2, 2, 3]
target = 2
```

Converted array:

```txt
[-1, +1, +1, -1]
```

The subarray `[1, 2, 2]` becomes:

```txt
[-1, +1, +1]
```

Sum:

```txt
-1 + 1 + 1 = 1
```

Since the sum is positive, `2` is the majority element.

The subarray `[1, 2, 2, 3]` becomes:

```txt
[-1, +1, +1, -1]
```

Sum:

```txt
0
```

This is not positive, so it is not valid. Equal half is not majority.

---

# Prefix Sum Interpretation

After converting the array, we can use prefix sums.

For:

```txt
converted = [-1, +1, +1, -1]
```

Prefix sums are:

```txt
pref[0] = 0
pref[1] = -1
pref[2] = 0
pref[3] = 1
pref[4] = 0
```

So:

```txt
pref = [0, -1, 0, 1, 0]
```

A subarray from index `i` to `j - 1` has sum:

```txt
pref[j] - pref[i]
```

We need this sum to be positive:

```txt
pref[j] - pref[i] > 0
```

Rearranging:

```txt
pref[j] > pref[i]
```

So the problem becomes:

```txt
Count pairs (i, j) where i < j and pref[j] > pref[i]
```

In simple words:

```txt
For every current prefix sum, count how many previous prefix sums are smaller.
```

---

# Why the Fenwick Tree Solution Works

A Fenwick Tree can answer:

```txt
How many previous prefix sums are smaller than the current prefix sum?
```

in `O(log n)` time.

So the Fenwick Tree solution has:

```txt
Time complexity: O(n log n)
Space complexity: O(n)
```

However, this problem has a special property:

```txt
Each converted value is only +1 or -1
```

That means the prefix sum only moves one step at a time:

```txt
+1 when nums[i] === target
-1 otherwise
```

Because of this, we can optimize further to `O(n)`.

---

# Optimized O(n) Solution

The optimized solution maintains two things:

```txt
freq[prefixSum] = how many times this prefix sum has appeared so far
validLeftPoints = number of previous prefix sums smaller than current prefix sum
```

`validLeftPoints` tells us how many valid subarrays end at the current index.

Then we add it to the final result:

```txt
result += validLeftPoints
```

## Initial State

Before processing any elements:

```txt
cumSum = 0
freq[0] = 1
validLeftPoints = 0
result = 0
```

`freq[0] = 1` represents `pref[0] = 0`, the prefix sum before the array starts.

This is necessary to count subarrays starting from index `0`.

---

# Key Trick

Since the prefix sum only moves by `+1` or `-1`, we can update `validLeftPoints` directly.

## Case 1: Current number is target

If `nums[i] === target`, then prefix sum moves up:

```txt
cumSum -> cumSum + 1
```

Suppose current prefix sum is `x`.

After moving up, new prefix sum becomes `x + 1`.

All previous prefix sums equal to `x` now become smaller than the new prefix sum.

So we do:

```txt
validLeftPoints += freq[x]
cumSum += 1
```

In code:

```ts
validLeftPoints += freq[cumSum + offset];
cumSum += 1;
```

## Case 2: Current number is not target

If `nums[i] !== target`, then prefix sum moves down:

```txt
cumSum -> cumSum - 1
```

Suppose current prefix sum is `x`.

After moving down, new prefix sum becomes `x - 1`.

Previous prefix sums equal to the new prefix sum are no longer smaller. They are equal, and equal does not count because majority must be strictly more than half.

So we do:

```txt
cumSum -= 1
validLeftPoints -= freq[cumSum]
```

In code:

```ts
cumSum -= 1;
validLeftPoints -= freq[cumSum + offset];
```

The order matters here. We first decrease `cumSum`, then subtract the frequency of the new prefix sum.

---

# Pseudocode Flow

```txt
function countMajoritySubarrays(nums, target):

    n = nums.length

    offset = n + 1
    freq = array of size 2 * n + 3, filled with 0

    cumSum = 0
    validLeftPoints = 0
    result = 0

    // pref[0] = 0 exists before processing anything
    freq[cumSum + offset] = 1

    for num in nums:

        if num == target:

            // Moving from cumSum to cumSum + 1
            // Previous prefixes equal to old cumSum now become smaller
            validLeftPoints += freq[cumSum + offset]

            cumSum += 1

        else:

            // Moving from cumSum to cumSum - 1
            cumSum -= 1

            // Previous prefixes equal to new cumSum are no longer smaller
            validLeftPoints -= freq[cumSum + offset]

        // validLeftPoints = valid subarrays ending at current index
        result += validLeftPoints

        // Record current prefix sum
        freq[cumSum + offset] += 1

    return result
```

---

# Flowchart-Style Explanation

```txt
Start
  |
  v
Set cumSum = 0
Set freq[0] = 1
Set validLeftPoints = 0
Set result = 0
  |
  v
Loop through each number in nums
  |
  v
Is num == target?
  |
  |-- Yes -------------------------------
  |                                      |
  v                                      |
Add freq[cumSum] to validLeftPoints      |
Move cumSum up by 1                      |
  |                                      |
  ----------------------------------------
  |
  |-- No --------------------------------
  |                                      |
  v                                      |
Move cumSum down by 1                    |
Subtract freq[cumSum] from validLeftPoints
  |                                      |
  ----------------------------------------
  |
  v
Add validLeftPoints to result
  |
  v
Increase freq[cumSum]
  |
  v
Continue loop
  |
  v
Return result
```

---

# Dry Run

Input:

```txt
nums = [1, 2, 2, 3]
target = 2
```

Converted array:

```txt
[-1, +1, +1, -1]
```

Prefix path:

```txt
0 -> -1 -> 0 -> 1 -> 0
```

Initial state:

```txt
cumSum = 0
freq[0] = 1
validLeftPoints = 0
result = 0
```

## Step 1: num = 1

`1` is not target.

Move down:

```txt
cumSum = -1
validLeftPoints -= freq[-1]
validLeftPoints = 0
```

Add to result:

```txt
result = 0
```

Record prefix:

```txt
freq[-1] = 1
```

## Step 2: num = 2

`2` is target.

Before moving up, `cumSum = -1`.

Previous prefixes equal to `-1` now become valid:

```txt
validLeftPoints += freq[-1]
validLeftPoints = 1
cumSum = 0
```

Add to result:

```txt
result = 1
```

This counts:

```txt
[2]
```

Record prefix:

```txt
freq[0] = 2
```

## Step 3: num = 2

`2` is target.

Before moving up, `cumSum = 0`.

Previous prefixes equal to `0` now become valid:

```txt
validLeftPoints += freq[0]
validLeftPoints = 1 + 2 = 3
cumSum = 1
```

Add to result:

```txt
result = 1 + 3 = 4
```

This adds the valid subarrays ending at this index:

```txt
[1,2,2]
[2,2]
[2]
```

Record prefix:

```txt
freq[1] = 1
```

## Step 4: num = 3

`3` is not target.

Move down:

```txt
cumSum = 0
```

Previous prefixes equal to `0` are no longer smaller:

```txt
validLeftPoints -= freq[0]
validLeftPoints = 3 - 2 = 1
```

Add to result:

```txt
result = 4 + 1 = 5
```

This counts:

```txt
[2,2,3]
```

Record prefix:

```txt
freq[0] = 3
```

Final answer:

```txt
5
```

---

# Complete TypeScript Solution

```ts
function countMajoritySubarrays(nums: number[], target: number): number {
    const n = nums.length;

    // Prefix sum can range from -n to +n.
    // Offset lets us safely use array indices instead of a Map.
    const offset = n + 1;
    const freq: number[] = new Array(2 * n + 3).fill(0);

    let cumSum = 0;
    let validLeftPoints = 0;
    let result = 0;

    // pref[0] = 0 exists before processing any element.
    freq[cumSum + offset] = 1;

    for (const num of nums) {
        if (num === target) {
            // Moving from cumSum to cumSum + 1.
            // Previous prefixes equal to old cumSum now become smaller.
            validLeftPoints += freq[cumSum + offset];
            cumSum += 1;
        } else {
            // Moving from cumSum to cumSum - 1.
            cumSum -= 1;

            // Previous prefixes equal to the new cumSum are no longer smaller.
            validLeftPoints -= freq[cumSum + offset];
        }

        // Number of valid subarrays ending at this index.
        result += validLeftPoints;

        // Record the current prefix sum.
        freq[cumSum + offset] += 1;
    }

    return result;
}
```

---

# Complexity Analysis

## Time Complexity

```txt
O(n)
```

Each element is processed once, and each operation inside the loop is constant time.

## Space Complexity

```txt
O(n)
```

The frequency array stores counts for possible prefix sums from `-n` to `+n`.

---

# Common Mistakes

## Mistake 1: Returning `0` instead of `result`

Wrong:

```ts
return 0;
```

Correct:

```ts
return result;
```

## Mistake 2: Forgetting `freq[0] = 1`

This misses subarrays starting from index `0`.

Correct initialization:

```ts
freq[cumSum + offset] = 1;
```

## Mistake 3: Wrong order in the non-target case

Wrong:

```ts
validLeftPoints -= freq[cumSum + offset];
cumSum -= 1;
```

Correct:

```ts
cumSum -= 1;
validLeftPoints -= freq[cumSum + offset];
```

We must subtract the frequency of the **new** prefix sum after moving down.

## Mistake 4: Thinking equal prefix sums are valid

Equal prefix sums mean:

```txt
subarray sum = 0
```

That means target appears exactly half the time, not more than half.

So equal does not count.

---

# Final Mental Model

Remember this solution like this:

```txt
Target makes prefix go up.
Non-target makes prefix go down.

validLeftPoints = number of previous prefixes below current prefix.

When going up:
    prefixes at old height newly become below.

When going down:
    prefixes at new height stop being below.
```

This is why the solution works in `O(n)` time.
