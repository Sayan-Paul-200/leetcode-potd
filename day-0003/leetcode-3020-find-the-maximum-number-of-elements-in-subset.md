# LeetCode 3020 — Find the Maximum Number of Elements in Subset

Problem link: https://leetcode.com/problems/find-the-maximum-number-of-elements-in-subset/

## Problem Summary

You are given an array of positive integers `nums`.

You need to select a subset of elements that can be rearranged into a special symmetric pattern:

```text
[x, x^2, x^4, ..., peak, ..., x^4, x^2, x]
```

Examples of valid patterns:

```text
[2, 4, 2]
[2, 4, 16, 4, 2]
[3, 9, 3]
```

Invalid pattern:

```text
[2, 4, 8, 4, 2]
```

This is invalid because `4^2 != 8`.

The task is to return the maximum number of elements we can select such that the selected elements can be arranged in this pattern.

---

## Important Clarification: Subset, Not Subarray

This problem asks for a **subset**, not a subarray.

That means positions do not matter. We can pick elements from anywhere in `nums` and rearrange them.

For example:

```text
nums = [5, 4, 1, 2, 2]
```

We can select:

```text
{2, 2, 4}
```

and rearrange it as:

```text
[2, 4, 2]
```

So this problem is mainly about frequency counting.

---

## Pattern Explanation

The pattern looks like this:

```text
[x, x^2, x^4, ..., peak, ..., x^4, x^2, x]
```

For `x = 2`, a valid longer pattern is:

```text
[2, 4, 16, 4, 2]
```

Required counts:

```text
2  -> 2 copies
4  -> 2 copies
16 -> 1 copy
```

Every value except the peak appears twice:

- once on the left side
- once on the right side

The peak appears once in the middle.

So every valid pattern has odd length:

```text
1, 3, 5, 7, ...
```

---

## Real-World Engineering Analogy

Think of building a symmetric workflow in a backend system:

```text
small service -> bigger service -> peak service -> bigger service -> small service
```

Every non-middle stage must have two matching resources:

```text
one for the forward journey
one for the return journey
```

The middle/peak stage only needs one resource.

So if we have:

```text
2 appears twice
4 appears once
```

we can build:

```text
[2, 4, 2]
```

But if we have:

```text
2 appears twice
4 appears zero times
```

we cannot build:

```text
[2, 4, 2]
```

The best we can do is:

```text
[2]
```

---

## Key Observations

### 1. Use a Frequency Map

Because this is a subset problem, we only need to know how many times each number appears.

In TypeScript, we can use:

```ts
Map<number, number>
```

Example:

```text
nums = [1, 2, 2, 4, 1, 3, 4]
```

Frequency map:

```text
1 -> 2
2 -> 2
3 -> 1
4 -> 2
```

---

### 2. For `x > 1`, the Squaring Chain Grows Very Fast

For a normal starting value like `2`, the chain is:

```text
2 -> 4 -> 16 -> 256 -> 65536 -> 4294967296
```

But the constraint says:

```text
nums[i] <= 1,000,000,000
```

So once the value becomes greater than `1e9`, it cannot exist in `nums`.

That means each chain is very short.

This is why it is safe to try every possible starting value and repeatedly square it.

---

### 3. The Number `1` Is Special

For `1`:

```text
1^2 = 1
```

So the chain does not grow:

```text
1 -> 1 -> 1 -> 1 -> ...
```

A valid pattern made only of `1`s must have odd length:

```text
[1]
[1, 1, 1]
[1, 1, 1, 1, 1]
```

So if `count(1)` is odd, we can use all of them.

If `count(1)` is even, we can use `count(1) - 1`.

Example:

```text
count(1) = 6
```

The maximum usable count is:

```text
5
```

---

## Brute Force Thinking

A very bad brute force approach would be:

```text
Try every possible subset
Check if it can be rearranged into a valid pattern
```

This is impossible for `n = 100000`.

A better idea is:

```text
For each unique value x:
    Try to build the chain x, x^2, x^4, x^8, ...
```

This works because the chain becomes huge very quickly.

---

## Algorithmic Flow

```text
1. Build a frequency map of all values in nums.

2. Initialize answer = 1.

3. Handle value 1 separately:
      ones = frequency of 1
      if ones is odd:
          answer = max(answer, ones)
      else:
          answer = max(answer, ones - 1)

4. For each unique value x where x > 1:
      current = x
      length = 0

      while frequency[current] >= 2:
          length += 2
          current = current * current

      if frequency[current] >= 1:
          length += 1
      else:
          length -= 1

      answer = max(answer, length)

5. Return answer.
```

---

## Why Do We Subtract 1 When the Peak Is Missing?

Suppose:

```text
nums = [2, 2]
```

Frequency:

```text
2 -> 2
4 -> 0
```

The loop sees two `2`s and temporarily thinks:

```text
length = 2
```

But a valid pattern cannot be:

```text
[2, 2]
```

The pattern must be odd length.

To use two `2`s, we would need a middle value:

```text
[2, 4, 2]
```

But `4` is missing.

So the best valid pattern is:

```text
[2]
```

That is why we do:

```text
length -= 1
```

turning `2` into `1`.

---

## Pseudocode

```text
function maximumLength(nums):

    freq = new Map()

    for num in nums:
        freq[num]++

    answer = 1

    ones = freq[1] or 0

    if ones > 0:
        if ones is odd:
            answer = max(answer, ones)
        else:
            answer = max(answer, ones - 1)

    for each x in freq.keys():

        if x == 1:
            continue

        current = x
        length = 0

        while freq[current] >= 2:
            length += 2
            current = current * current

            if current > 1e9:
                break

        if freq[current] >= 1:
            length += 1
        else:
            length -= 1

        answer = max(answer, length)

    return answer
```

---

## Flowchart-Style Explanation

```text
Start
  |
  v
Build frequency map
  |
  v
Set answer = 1
  |
  v
Handle 1 separately using the largest odd count
  |
  v
For each unique x > 1:
  |
  v
current = x
length = 0
  |
  v
Do we have at least 2 copies of current?
  |
  |-- Yes ---------------------------------
  |                                        |
  v                                        |
Use current on both sides                  |
length += 2                                |
current = current * current                |
  |                                        |
  ------------------------------------------
  |
  |-- No
  |
  v
Do we have at least 1 copy of current?
  |
  |-- Yes --> use it as peak, length += 1
  |
  |-- No  --> peak is missing, length -= 1
  |
  v
Update answer
  |
  v
Return answer
```

---

## Complete TypeScript Solution

```ts
function maximumLength(nums: number[]): number {
    const freq = new Map<number, number>();

    for (const num of nums) {
        freq.set(num, (freq.get(num) ?? 0) + 1);
    }

    let answer = 1;

    // Special case: 1^2 = 1, so we can only use an odd number of 1s.
    const ones = freq.get(1) ?? 0;
    if (ones > 0) {
        answer = Math.max(answer, ones % 2 === 1 ? ones : ones - 1);
    }

    for (const x of freq.keys()) {
        if (x === 1) continue;

        let current = x;
        let length = 0;

        while ((freq.get(current) ?? 0) >= 2) {
            length += 2;

            current = current * current;

            // nums[i] <= 1e9, so values beyond this cannot exist in nums.
            if (current > 1e9) {
                break;
            }
        }

        if ((freq.get(current) ?? 0) >= 1) {
            length += 1;
        } else {
            length -= 1;
        }

        answer = Math.max(answer, length);
    }

    return answer;
}
```

---

## Dry Run 1

Input:

```text
nums = [5, 4, 1, 2, 2]
```

Frequency map:

```text
5 -> 1
4 -> 1
1 -> 1
2 -> 2
```

Start with `x = 2`:

```text
current = 2
freq[2] = 2
length += 2
length = 2
current = 4
```

Now:

```text
freq[4] = 1
```

So `4` can be the peak:

```text
length += 1
length = 3
```

Pattern:

```text
[2, 4, 2]
```

Answer:

```text
3
```

---

## Dry Run 2

Input:

```text
nums = [1, 2, 2, 4, 1, 3, 4]
```

Frequency map:

```text
1 -> 2
2 -> 2
3 -> 1
4 -> 2
```

Handle `1`:

```text
ones = 2
largest odd usable count = 1
answer = 1
```

Try `x = 2`:

```text
current = 2
length = 0
freq[2] = 2
```

Use two `2`s:

```text
length = 2
current = 4
```

Now:

```text
freq[4] = 2
```

Use two `4`s temporarily:

```text
length = 4
current = 16
```

Now:

```text
freq[16] = 0
```

Peak is missing, so:

```text
length -= 1
length = 3
```

Best pattern:

```text
[2, 4, 2]
```

Final answer:

```text
3
```

---

## Edge Cases

### Edge Case 1: Only two same numbers

```text
nums = [2, 2]
```

We cannot form `[2, 4, 2]` because `4` is missing.

Answer:

```text
1
```

---

### Edge Case 2: Many ones

```text
nums = [1, 1, 1, 1, 1, 1]
```

There are 6 ones.

The largest odd number we can use is 5.

Answer:

```text
5
```

---

### Edge Case 3: Full chain

```text
nums = [2, 2, 4, 4, 16]
```

Valid pattern:

```text
[2, 4, 16, 4, 2]
```

Answer:

```text
5
```

---

### Edge Case 4: Single copies only

```text
nums = [1, 3, 2, 4]
```

No longer symmetric chain can be formed.

Answer:

```text
1
```

---

## Complexity Analysis

Let:

```text
n = nums.length
M = max(nums)
```

Building the frequency map takes:

```text
O(n)
```

For each unique value, we repeatedly square:

```text
x -> x^2 -> x^4 -> x^8 -> ...
```

This chain is very short because `M <= 1e9`.

Formal time complexity:

```text
O(n log log M)
```

In practice, since `log log M` is tiny for `M <= 1e9`, this behaves like:

```text
O(n)
```

Space complexity:

```text
O(n)
```

because we store the frequency map.

---

## Common Mistakes to Avoid

### Mistake 1: Treating this as a subarray problem

This is not about continuous ranges.

It is about selecting a subset and rearranging it.

---

### Mistake 2: Forgetting that the length must be odd

Valid patterns have lengths:

```text
1, 3, 5, 7, ...
```

So `[2, 2]` is not valid.

---

### Mistake 3: Not handling `1` separately

If we treat `1` like other numbers, the loop may become infinite because:

```text
1 * 1 = 1
```

So `1` must be handled as a special case.

---

### Mistake 4: Using a Set instead of a frequency map

A Set can only tell whether a value exists.

But this problem needs to know whether a value appears at least twice.

So use a frequency map.

---

## Final Key Insight

For each possible starting value `x`, try to build this chain:

```text
x -> x^2 -> x^4 -> x^8 -> ...
```

Every non-peak value needs 2 copies.

The final peak needs 1 copy.

Handle `1` separately because it never grows when squared.
