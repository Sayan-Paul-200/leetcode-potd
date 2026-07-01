function maximumSafenessFactor(grid: number[][]): number {
    const n = grid.length;
    const directions = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
    ];

    // Step 1: Multi-source BFS from all thief cells.
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

    // Step 2: Check whether we can reach the end using only cells
    // whose distance to the nearest thief is at least safeValue.
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

    // Step 3: Binary search the maximum possible safeness factor.
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