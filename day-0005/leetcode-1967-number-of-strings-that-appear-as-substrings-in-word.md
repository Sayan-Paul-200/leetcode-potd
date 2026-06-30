# LeetCode 1967 — Number of Strings That Appear as Substrings in Word

Problem link: https://leetcode.com/problems/number-of-strings-that-appear-as-substrings-in-word/

## Problem Summary

You are given:

- An array of strings `patterns`
- A string `word`

You need to count how many strings from `patterns` appear as a substring inside `word`.

A substring is a contiguous sequence of characters inside another string.

For example, in the word:

```txt
"abc"
```

These are substrings:

```txt
"a", "b", "c", "ab", "bc", "abc"
```

But this is not a substring:

```txt
"ac"
```

because `a` and `c` are not contiguous in `"abc"`.

---

## Examples

### Example 1

```txt
Input: patterns = ["a", "abc", "bc", "d"], word = "abc"
Output: 3
```

Explanation:

```txt
"a"   appears in "abc"
"abc" appears in "abc"
"bc"  appears in "abc"
"d"   does not appear in "abc"
```

So the answer is:

```txt
3
```

---

### Example 2

```txt
Input: patterns = ["a", "b", "c"], word = "aaaaabbbbb"
Output: 2
```

Explanation:

```txt
"a" appears
"b" appears
"c" does not appear
```

So the answer is:

```txt
2
```

---

### Example 3

```txt
Input: patterns = ["a", "a", "a"], word = "ab"
Output: 3
```

Explanation:

Each `"a"` in `patterns` is counted separately.

Even though all three patterns are the same string, they are three separate entries in the array.

So the answer is:

```txt
3
```

---

## Input

```ts
patterns: string[]
word: string
```

Constraints:

```txt
1 <= patterns.length <= 100
1 <= patterns[i].length <= 100
1 <= word.length <= 100
patterns[i] and word consist of lowercase English letters.
```

---

## Output

```ts
number
```

The output is the number of strings in `patterns` that appear as substrings in `word`.

---

## Key Observation

The constraints are very small:

```txt
patterns.length <= 100
patterns[i].length <= 100
word.length <= 100
```

So we do not need advanced string algorithms like:

- KMP
- Trie
- Aho-Corasick
- Rolling Hash
- Suffix Array

The intended solution is to check each pattern individually using the built-in TypeScript/JavaScript method:

```ts
word.includes(pattern)
```

---

## Real-World Software Engineering Analogy

Imagine you are building a logging or analytics dashboard.

You have one log message:

```txt
"payment_failed_due_to_timeout"
```

And you have a list of keywords:

```txt
["payment", "timeout", "success", "failed"]
```

You want to count how many keywords appear inside the log message.

Result:

```txt
"payment" appears
"timeout" appears
"success" does not appear
"failed" appears
```

So the answer is:

```txt
3
```

This type of logic can appear in:

- Search filters
- Log classification
- Moderation keyword checks
- URL/path matching
- Feature flag name checks
- Basic analytics pipelines

---

## Important Detail: Duplicates Count Separately

This problem counts every entry in `patterns`, not every unique string.

For example:

```txt
patterns = ["a", "a", "a"]
word = "ab"
```

Each `"a"` appears in `"ab"`, so the answer is:

```txt
3
```

Because of this, we should not convert `patterns` into a `Set`.

Wrong idea:

```ts
const uniquePatterns = new Set(patterns);
```

This would incorrectly turn:

```txt
["a", "a", "a"]
```

into:

```txt
["a"]
```

and would return `1` instead of `3`.

---

## Brute Force Thinking

A manual brute-force approach would be:

```txt
For each pattern:
    Try every starting index in word:
        Compare characters one by one
```

Example:

```txt
word = "abc"
pattern = "bc"
```

Try index `0`:

```txt
word[0..1] = "ab"
not a match
```

Try index `1`:

```txt
word[1..2] = "bc"
match
```

This works, but we do not need to manually implement it because TypeScript already provides substring checking through `includes()`.

---

## Optimized Practical Approach

Use:

```ts
word.includes(pattern)
```

This checks whether `pattern` exists anywhere inside `word`.

Examples:

```ts
"abc".includes("a")   // true
"abc".includes("bc")  // true
"abc".includes("abc") // true
"abc".includes("d")   // false
"abc".includes("ac")  // false
```

Then count how many patterns return `true`.

---

## Algorithmic Flow

```txt
1. Initialize count = 0.

2. Loop through every pattern in patterns.

3. For each pattern:
      Check whether word includes pattern.

4. If yes:
      Increment count.

5. Return count.
```

---

## Pseudocode

```txt
function numOfStrings(patterns, word):

    count = 0

    for each pattern in patterns:

        if word contains pattern:
            count = count + 1

    return count
```

Compact version:

```txt
count all patterns where word.includes(pattern)
```

---

## Flowchart-Style Explanation

```txt
Start
  |
  v
count = 0
  |
  v
Take next pattern
  |
  v
Does word contain pattern?
  |
  |-- Yes --> count++
  |
  |-- No  --> do nothing
  |
  v
Are there more patterns?
  |
  |-- Yes --> repeat
  |
  |-- No
  |
  v
Return count
```

---

## Important Variables

### `patterns`

The array of strings we need to check.

Example:

```ts
["a", "abc", "bc", "d"]
```

### `word`

The main string where each pattern is searched.

Example:

```ts
"abc"
```

### `count`

The number of patterns that appear inside `word`.

### `pattern`

The current pattern being checked in the loop.

---

## TypeScript Solution

```ts
function numOfStrings(patterns: string[], word: string): number {
    let count = 0;

    for (const pattern of patterns) {
        if (word.includes(pattern)) {
            count++;
        }
    }

    return count;
}
```

---

## Dry Run

Input:

```ts
patterns = ["a", "abc", "bc", "d"]
word = "abc"
```

Initial state:

```txt
count = 0
```

Process each pattern:

```txt
pattern = "a"
"abc" includes "a" -> true
count = 1
```

```txt
pattern = "abc"
"abc" includes "abc" -> true
count = 2
```

```txt
pattern = "bc"
"abc" includes "bc" -> true
count = 3
```

```txt
pattern = "d"
"abc" includes "d" -> false
count stays 3
```

Final answer:

```txt
3
```

---

## Edge Case Testing

### Case 1: Duplicate patterns

```ts
numOfStrings(["a", "a", "a"], "ab")
```

Expected:

```txt
3
```

Reason: each `"a"` is counted separately.

---

### Case 2: Pattern equals word

```ts
numOfStrings(["abc"], "abc")
```

Expected:

```txt
1
```

Reason: a string is a substring of itself.

---

### Case 3: Pattern longer than word

```ts
numOfStrings(["abcd"], "abc")
```

Expected:

```txt
0
```

Reason: a longer pattern cannot fit inside a shorter word.

---

### Case 4: No pattern matches

```ts
numOfStrings(["x", "y", "z"], "abc")
```

Expected:

```txt
0
```

---

### Case 5: Multiple overlapping patterns

```ts
numOfStrings(["a", "aa", "aaa"], "aaaa")
```

Expected:

```txt
3
```

Reason: all three patterns appear inside `"aaaa"`.

---

## Complexity Analysis

Let:

```txt
p = number of patterns
n = word.length
m = average pattern length
```

For each pattern, `word.includes(pattern)` may scan through `word` and compare characters.

So a simple upper-bound model is:

```txt
O(p * n * m)
```

Given the constraints:

```txt
p <= 100
n <= 100
m <= 100
```

this is completely acceptable.

Space complexity:

```txt
O(1)
```

because we only use a counter.

---

## Common Mistakes

### Mistake 1: Removing duplicates

Do not use a `Set` on `patterns` because duplicate patterns must be counted separately.

Wrong:

```ts
for (const pattern of new Set(patterns)) {
    // incorrect for duplicate patterns
}
```

---

### Mistake 2: Confusing substring with subsequence

For:

```txt
word = "abc"
pattern = "ac"
```

`"ac"` is not a substring because the characters are not contiguous.

So it should not be counted.

---

### Mistake 3: Overengineering

Advanced algorithms are unnecessary here because the constraints are small.

The built-in `includes()` method is the intended and cleanest approach.

---

## Final Takeaway

The main lesson from this problem is:

```txt
When constraints are small and the task is direct, prefer simple built-in tools over unnecessary complex algorithms.
```

The solution is simply:

```txt
Check each pattern individually and count how many are substrings of word.
```
