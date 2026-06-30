# LeetCode 1846 — Maximum Element After Decreasing and Rearranging

Problem link: https://leetcode.com/problems/maximum-element-after-decreasing-and-rearranging/

## Problem Summary

You are given an array of positive integers `arr`.

You are allowed to perform two kinds of operations:

1. Rearrange the elements in any order.
2. Decrease any element to a smaller positive integer.

After performing operations, the array must satisfy these conditions:

1. The first element must be `1`.
2. The absolute difference between any two adjacent elements must be at most `1`.

In other words:

```txt
arr[0] = 1
abs(arr[i] - arr[i - 1]) <= 1
```

The goal is to return the maximum possible value of any element in the final valid array.

---

## Simple Explanation

We want to rearrange and decrease the numbers so that the final array starts from `1` and grows smoothly.

A valid ideal-looking array could be:

```txt
[1, 2, 3, 4, 5]
```

This is valid because every adjacent difference is exactly `1`.

Another valid array:

```txt
[1, 1, 2, 2, 3]
```

This is also valid because adjacent differences are never more than `1`.

But this is invalid:

```txt
[1, 3, 4]
```

because:

```txt
abs(3 - 1) = 2
```

which is greater than `1`.

Since we can rearrange freely, the original order does not matter. Since we can only decrease values, we need to use the available numbers carefully.

---

## Key Insight

Sorting helps because smaller numbers should be used earlier.

After sorting, we greedily try to build the largest valid final value step by step.

We maintain a variable:

```ts
answer
```

This represents the largest valid value we can currently build.

Initially:

```ts
answer = 0
```

For each number `num` in the sorted array:

```txt
If num > answer, then this number can help us build answer + 1.
```

So we do:

```ts
answer++
```

Why?

Because if `num > answer`, then `num` is large enough to be decreased to `answer + 1`.

If `num <= answer`, then it cannot help us increase the maximum value, because we cannot increase numbers.

---

## Real-World Software Engineering Analogy

Imagine you are assigning access levels in an enterprise SaaS system.

You have raw user scores:

```txt
[100, 1, 1000]
```

But the system requires access levels to start at `1`, and each next access level can increase by at most `1`.

You can downgrade users, but you cannot upgrade them.

So after sorting:

```txt
[1, 100, 1000]
```

You can assign:

```txt
[1, 2, 3]
```

The highest valid access level is `3`.

This is exactly what the greedy algorithm does.

---

## Why Sorting Works

Because we are allowed to rearrange the array, the best order is ascending order.

Sorting gives smaller numbers the earliest positions, where smaller values are needed.

For example:

```txt
arr = [100, 1, 1000]
```

Sorted:

```txt
[1, 100, 1000]
```

Now we can greedily build:

```txt
1 -> 2 -> 3
```

If we did not sort, we might process large values too early and lose the greedy structure.

---

## Greedy Rule

For each sorted number `num`:

```txt
If num > answer:
    answer += 1
Else:
    answer stays the same
```

This works because `answer` means:

```txt
The largest valid value we can build so far.
```

If the current number is bigger than `answer`, it can be decreased to `answer + 1`.

If the current number is not bigger than `answer`, it cannot help us increase the maximum.

---

## Pseudocode

```txt
function maximumElementAfterDecrementingAndRearranging(arr):

    sort arr in ascending order

    answer = 0

    for each num in arr:

        if num > answer:
            answer = answer + 1

    return answer
```

---

## Flowchart-Style Explanation

```txt
Start
  |
  v
Sort arr in ascending order
  |
  v
answer = 0
  |
  v
For each num in sorted arr:
  |
  v
Is num > answer?
  |
  |-- Yes --> answer += 1
  |
  |-- No  --> answer stays same
  |
  v
Continue until all numbers are processed
  |
  v
Return answer
```

---

## Important Variables

### `arr`

The input array. We sort it so smaller values are processed first.

### `answer`

The maximum valid value we can build so far.

At the end, this becomes the final answer.

### `num`

The current number being processed in sorted order.

---

## Dry Run 1

Input:

```ts
arr = [100, 1, 1000]
```

Sort:

```txt
[1, 100, 1000]
```

Initial state:

```txt
answer = 0
```

Process `1`:

```txt
1 > 0
answer = 1
```

Process `100`:

```txt
100 > 1
answer = 2
```

Process `1000`:

```txt
1000 > 2
answer = 3
```

Final answer:

```txt
3
```

One possible final valid array:

```txt
[1, 2, 3]
```

---

## Dry Run 2

Input:

```ts
arr = [2, 2, 1, 2, 1]
```

Sort:

```txt
[1, 1, 2, 2, 2]
```

Initial state:

```txt
answer = 0
```

Process step by step:

```txt
num = 1, answer = 0
1 > 0, so answer = 1

num = 1, answer = 1
1 > 1? no, answer stays 1

num = 2, answer = 1
2 > 1, so answer = 2

num = 2, answer = 2
2 > 2? no, answer stays 2

num = 2, answer = 2
2 > 2? no, answer stays 2
```

Final answer:

```txt
2
```

One valid rearrangement is:

```txt
[1, 2, 2, 2, 1]
```

The maximum element is `2`.

---

## Dry Run 3

Input:

```ts
arr = [1, 2, 3, 4, 5]
```

Sort:

```txt
[1, 2, 3, 4, 5]
```

Process:

```txt
answer = 0

1 > 0 -> answer = 1
2 > 1 -> answer = 2
3 > 2 -> answer = 3
4 > 3 -> answer = 4
5 > 4 -> answer = 5
```

Final answer:

```txt
5
```

The array is already valid.

---

## Hidden Edge Cases

### Edge Case 1: Single Element

Input:

```txt
[999]
```

We must make the first element `1`.

Final answer:

```txt
1
```

---

### Edge Case 2: All Ones

Input:

```txt
[1, 1, 1, 1]
```

We cannot increase any value.

Final answer:

```txt
1
```

---

### Edge Case 3: Many Large Values

Input:

```txt
[100, 100, 100, 100]
```

After decreasing, we can make:

```txt
[1, 2, 3, 4]
```

Final answer:

```txt
4
```

---

## Final TypeScript Solution

```ts
function maximumElementAfterDecrementingAndRearranging(arr: number[]): number {
    arr.sort((a, b) => a - b);

    let answer = 0;

    for (const num of arr) {
        if (num > answer) {
            answer++;
        }
    }

    return answer;
}
```

---

## Why This Code Is Correct

After sorting, we process numbers from smallest to largest.

At any point, `answer` is the largest valid value we can build so far.

If the current number `num` is greater than `answer`, then it can be decreased to `answer + 1`, so we safely increase `answer`.

If `num <= answer`, then this number cannot help increase the maximum value because increasing is not allowed.

So the greedy choice is always safe.

---

## Complexity Analysis

Let:

```txt
n = arr.length
```

Sorting takes:

```txt
O(n log n)
```

The loop takes:

```txt
O(n)
```

Total time complexity:

```txt
O(n log n)
```

Space complexity:

```txt
O(1)
```

excluding internal sorting implementation details.

---

## Common Mistakes

### Mistake 1: Forgetting Numeric Sort in TypeScript

Wrong:

```ts
arr.sort();
```

This sorts numbers as strings.

Correct:

```ts
arr.sort((a, b) => a - b);
```

---

### Mistake 2: Thinking We Can Increase Values

We can only decrease values.

For example:

```txt
[1, 1, 1, 1]
```

cannot become:

```txt
[1, 2, 3, 4]
```

because that would require increasing some values.

---

### Mistake 3: Returning `arr.length` Always

The maximum possible answer is at most `arr.length`, but it is not always equal to `arr.length`.

Example:

```txt
[1, 1, 1, 1]
```

Answer is:

```txt
1
```

not:

```txt
4
```

---

## Key Takeaway

The core idea is:

```txt
Sort first, then greedily build the largest valid value one step at a time.
```

The value `answer` represents the current largest valid number we can create.

Whenever a sorted number is large enough to become `answer + 1`, we extend the valid sequence.
