# LeetCode 2812 — Find the Safest Path in a Grid

Problem link: https://leetcode.com/problems/find-the-safest-path-in-a-grid/

## Problem Summary

You are given an `n x n` grid where:

- `grid[r][c] = 1` means the cell contains a thief.
- `grid[r][c] = 0` means the cell is empty.

You start at the top-left cell:

```txt
(0, 0)
```

You need to reach the bottom-right cell:

```txt
(n - 1, n - 1)
```

You can move in four directions:

```txt
up, down, left, right
```

You are allowed to move through thief cells, but thief cells have safeness `0`.

The **safeness factor** of a path is the minimum Manhattan distance from any cell on that path to the nearest thief.

The goal is to return the maximum possible safeness factor among all paths from `(0, 0)` to `(n - 1, n - 1)`.

---

## Layman’s Explanation

Think of the grid as a map.

Some cells contain thieves. You want to travel from the top-left corner to the bottom-right corner while staying as far away from thieves as possible.

However, the safety of a path is determined by the most dangerous cell on that path.

For example, if most cells on your path are far from thieves, but one cell is directly beside a thief, then the whole path is only as safe as that closest point.

So this is a **maximize the minimum** problem:

```txt
Choose the path whose worst cell is as safe as possible.
```

---

## Input

```ts
function maximumSafenessFactor(grid: number[][]): number
```

Where:

```txt
grid.length = n
grid[i].length = n
grid[i][j] is either 0 or 1
```

Constraints:

```txt
1 <= n <= 400
There is at least one thief in the grid.
```

---

## Output

Return a single number:

```txt
the maximum possible safeness factor
```

---

## Important Concepts

This problem combines three important ideas:

1. **Multi-source BFS**
2. **Binary search on answer**
3. **BFS reachability check**

---

## Real-World Software Engineering Analogy

Imagine a data center represented as a grid.

Some zones are compromised:

```txt
1 = compromised zone
0 = normal zone
```

You need to route traffic from the entry point to the exit point.

A route is safer if every zone along the route stays far away from compromised zones.

The safety of the full route is controlled by the weakest point, meaning the zone that gets closest to a compromised zone.

This is similar to:

- network routing around failed or compromised nodes,
- robot path planning around hazards,
- security-zone traversal,
- game AI pathfinding,
- delivery routing around dangerous areas.

---

## Why Brute Force Is Not Possible

A brute-force idea would be:

```txt
Try every possible path from start to end.
For each path, calculate its minimum distance to a thief.
Return the best value.
```

This is impossible because the number of paths in a grid can be extremely large.

For `n = 400`, the grid has:

```txt
400 * 400 = 160,000 cells
```

Trying all paths is not feasible.

---

## Key Insight 1: Calculate the Safety Value of Every Cell

Before finding the safest path, we first calculate this for every cell:

```txt
dist[r][c] = distance from cell (r, c) to the nearest thief
```

This transforms the original thief grid into a safety-distance grid.

Example:

```txt
grid = [
  [0, 0, 1],
  [0, 0, 0],
  [0, 0, 0]
]
```

There is a thief at `(0, 2)`.

The distance grid becomes:

```txt
[
  [2, 1, 0],
  [3, 2, 1],
  [4, 3, 2]
]
```

Each number tells us how far that cell is from the nearest thief.

---

## How to Calculate the Distance Grid

Use **multi-source BFS**.

Instead of starting BFS from one cell, we start BFS from all thief cells at the same time.

All thief cells begin with distance `0`:

```txt
thief cells -> distance 0
neighbors   -> distance 1
next layer  -> distance 2
next layer  -> distance 3
```

This works because grid BFS naturally calculates Manhattan distance.

---

## Why Multi-Source BFS Works

If multiple thieves exist, each thief spreads a “danger wave” outward.

The first time a cell is reached by BFS, it is reached from its nearest thief.

So the resulting `dist[r][c]` is guaranteed to be the minimum distance to any thief.

---

## Key Insight 2: Check Whether a Safeness Factor Is Possible

Suppose we guess a safeness factor `v`.

We ask:

```txt
Can we go from (0, 0) to (n - 1, n - 1)
using only cells where dist[r][c] >= v?
```

If yes, then safeness `v` is possible.

If no, then `v` is too high.

For example, if `v = 2`, then all cells with safety less than `2` are treated as blocked.

---

## Key Insight 3: Binary Search Works

The answer has a monotonic property.

If safeness `3` is possible, then safeness `2`, `1`, and `0` are also possible.

If safeness `5` is impossible, then safeness `6`, `7`, and higher are also impossible.

So the possible values look like this:

```txt
0 possible
1 possible
2 possible
3 possible
4 impossible
5 impossible
6 impossible
```

This means we can binary search the maximum valid safeness factor.

---

## Full Algorithmic Flow

```txt
1. Let n = grid.length.

2. Create dist[n][n], filled with Infinity.

3. Push all thief cells into a BFS queue:
      dist[r][c] = 0

4. Run multi-source BFS:
      For every cell, calculate its distance to the nearest thief.

5. Binary search the safeness factor:
      low = 0
      high = maximum value in dist

6. For each mid:
      Check whether start can reach end using only cells with dist[r][c] >= mid.

7. If yes:
      Save mid as a possible answer and try a larger value.

8. If no:
      Try a smaller value.

9. Return the largest valid value.
```

---

## Pseudocode

```txt
function maximumSafenessFactor(grid):

    n = grid.length
    dist = n x n array filled with Infinity
    queue = empty queue

    // Step 1: Start BFS from all thief cells
    for r from 0 to n - 1:
        for c from 0 to n - 1:
            if grid[r][c] == 1:
                dist[r][c] = 0
                queue.push([r, c])

    // Step 2: Multi-source BFS
    while queue is not empty:
        [r, c] = queue.popFront()

        for each direction [dr, dc]:
            nr = r + dr
            nc = c + dc

            if nr,nc is inside grid and dist[nr][nc] is Infinity:
                dist[nr][nc] = dist[r][c] + 1
                queue.push([nr, nc])

    function canReach(safeValue):

        if dist[0][0] < safeValue:
            return false

        if dist[n - 1][n - 1] < safeValue:
            return false

        visited = n x n false
        bfsQueue = [[0, 0]]
        visited[0][0] = true

        while bfsQueue is not empty:
            [r, c] = bfsQueue.popFront()

            if r == n - 1 and c == n - 1:
                return true

            for each direction [dr, dc]:
                nr = r + dr
                nc = c + dc

                if nr,nc is inside grid
                   and not visited[nr][nc]
                   and dist[nr][nc] >= safeValue:

                    visited[nr][nc] = true
                    bfsQueue.push([nr, nc])

        return false

    low = 0
    high = maximum value in dist
    answer = 0

    while low <= high:
        mid = floor((low + high) / 2)

        if canReach(mid):
            answer = mid
            low = mid + 1
        else:
            high = mid - 1

    return answer
```

---

## Flowchart-Style Explanation

```txt
Start
  |
  v
Create distance grid
  |
  v
Put all thief cells into BFS queue with distance 0
  |
  v
Run multi-source BFS
  |
  v
Every cell now knows distance to nearest thief
  |
  v
Binary search safeness factor
  |
  v
Pick middle value mid
  |
  v
Can we reach end using only cells with distance >= mid?
  |
  |-- Yes --> mid is possible, try bigger
  |
  |-- No  --> mid is too high, try smaller
  |
  v
Return largest possible safeness factor
```

---

## TypeScript Solution

```ts
function maximumSafenessFactor(grid: number[][]): number {
    const n = grid.length;
    const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];

    const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(Infinity));
    const queue: number[][] = [];

    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            if (grid[r][c] === 1) {
                dist[r][c] = 0;
                queue.push([r, c]);
            }
        }
    }

    let head = 0;

    while (head < queue.length) {
        const [r, c] = queue[head++];

        for (const [dr, dc] of directions) {
            const nr = r + dr;
            const nc = c + dc;

            if (
                nr >= 0 &&
                nr < n &&
                nc >= 0 &&
                nc < n &&
                dist[nr][nc] === Infinity
            ) {
                dist[nr][nc] = dist[r][c] + 1;
                queue.push([nr, nc]);
            }
        }
    }

    function canReach(safeValue: number): boolean {
        if (dist[0][0] < safeValue || dist[n - 1][n - 1] < safeValue) {
            return false;
        }

        const visited: boolean[][] = Array.from({ length: n }, () => Array(n).fill(false));
        const bfsQueue: number[][] = [[0, 0]];
        visited[0][0] = true;

        let bfsHead = 0;

        while (bfsHead < bfsQueue.length) {
            const [r, c] = bfsQueue[bfsHead++];

            if (r === n - 1 && c === n - 1) {
                return true;
            }

            for (const [dr, dc] of directions) {
                const nr = r + dr;
                const nc = c + dc;

                if (
                    nr >= 0 &&
                    nr < n &&
                    nc >= 0 &&
                    nc < n &&
                    !visited[nr][nc] &&
                    dist[nr][nc] >= safeValue
                ) {
                    visited[nr][nc] = true;
                    bfsQueue.push([nr, nc]);
                }
            }
        }

        return false;
    }

    let low = 0;
    let high = 0;

    for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
            high = Math.max(high, dist[r][c]);
        }
    }

    let answer = 0;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);

        if (canReach(mid)) {
            answer = mid;
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return answer;
}
```

---

## Dry Run: Example 2

Input:

```txt
grid = [
  [0, 0, 1],
  [0, 0, 0],
  [0, 0, 0]
]
```

The thief is at `(0, 2)`.

After multi-source BFS, the distance grid is:

```txt
[
  [2, 1, 0],
  [3, 2, 1],
  [4, 3, 2]
]
```

Now we binary search the answer.

Candidate safeness `2`:

Allowed cells are those with distance at least `2`:

```txt
[
  [2, X, X],
  [3, 2, X],
  [4, 3, 2]
]
```

There is a valid path:

```txt
(0,0) -> (1,0) -> (2,0) -> (2,1) -> (2,2)
```

So safeness `2` is possible.

Candidate safeness `3`:

Start cell `(0,0)` has distance `2`, which is less than `3`.

So safeness `3` is impossible.

Final answer:

```txt
2
```

---

## Edge Cases

### Start or End Is a Thief

If `grid[0][0] = 1` or `grid[n - 1][n - 1] = 1`, then any path includes a thief cell.

So the safeness factor must be:

```txt
0
```

### `n = 1`

If the grid has one cell and there is at least one thief, the grid is:

```txt
[[1]]
```

Start and end are the same thief cell.

Answer:

```txt
0
```

### Many Thieves

Multi-source BFS handles this naturally because all thieves start in the queue with distance `0`.

---

## Complexity Analysis

Let:

```txt
N = n * n
```

Multi-source BFS visits every cell once:

```txt
O(N)
```

Each binary-search check also runs BFS over the grid:

```txt
O(N)
```

The maximum distance is at most about `2n`, so binary search takes:

```txt
O(log n)
```

Total time complexity:

```txt
O(n² log n)
```

Space complexity:

```txt
O(n²)
```

because of the distance grid, visited grid, and BFS queues.

---

## Common Mistakes to Avoid

### 1. Using `queue.shift()` in TypeScript

`shift()` removes from the front of an array and can be slow.

Use a head pointer instead:

```ts
let head = 0;
while (head < queue.length) {
    const item = queue[head++];
}
```

### 2. Treating Thief Cells as Blocked

Thief cells are not blocked.

You may step on them, but their safety distance is `0`.

### 3. Running BFS Separately From Every Cell

That would be too slow.

Correct approach:

```txt
Run one BFS from all thieves together.
```

### 4. Checking Only Shortest Path

This problem is not asking for the shortest path.

It asks for the safest path, which may be longer.

---

## Final Learning Summary

This problem teaches an important advanced pattern:

```txt
Precompute useful cell values using BFS,
then binary search the answer,
then validate each candidate using BFS/DFS.
```

The key ideas are:

```txt
1. Multi-source BFS calculates distance to nearest thief.
2. A path with safeness v uses only cells with dist >= v.
3. If safeness v is possible, all smaller values are possible.
4. That monotonic property allows binary search.
```
