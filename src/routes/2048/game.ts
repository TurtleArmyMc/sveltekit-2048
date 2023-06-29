const n: number = 4;

export type Move = "up" | "down" | "left" | "right";


function offsetFor(move: Move): [number, number] {
    const rOffset = move == "up" ? -1 : move == "down" ? 1 : 0;
    const cOffset = move == "left" ? -1 : move == "right" ? 1 : 0;
    return [rOffset, cOffset];
}

export class Game {
    board: number[][];
    prevBoard: number[][];
    /** How far the tile that was in this position moved away (in tiles) */
    moveAwayDistance: number[][];
    /** How far the tile that is now in this position moved to get here (in tiles) */
    moveToDistance: number[][];
    prevMove: Move | undefined;

    constructor() {
        this.board = [];
        this.prevBoard = [];
        this.moveAwayDistance = [];
        this.moveToDistance = [];
        for (let i = 0; i < n; i++) {
            this.board.push(Array(n).fill(0));
            this.prevBoard.push(Array(n).fill(0));
            this.moveAwayDistance.push(Array(n).fill(0));
            this.moveToDistance.push(Array(n).fill(0));
        }
        this.spawnNewTile();
    }

    moveIsValid(move: Move) {
        const [rOffset, cOffset] = offsetFor(move);

        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                const v = this.board[r][c];
                if (v == 0) {
                    continue;
                }
                const r2 = r + rOffset;
                const c2 = c + cOffset;
                if (0 <= r2 && 0 <= c2 && r2 < n && c2 < n) {
                    // A tile that is empty or can be combined in the direction
                    // of the move with the current tile
                    if (this.board[r2][c2] == v || this.board[r2][c2] == 0) {
                        return true
                    }
                }
            }
        }
        return false;
    }

    gameOver(): boolean {
        return !this.moveIsValid("up") && !this.moveIsValid("down") && !this.moveIsValid("left") && !this.moveIsValid("right");
    }

    makeMove(move: Move): boolean {
        if (!this.moveIsValid(move)) {
            return false;
        }

        this.prevMove = move;
        this.setPrevBoard();

        if (move == "up") {
            for (let c = 0; c < n; c++) {
                let mergedLast = false;
                for (let ri = 1; ri < n; ri++) {
                    const v = this.board[ri][c];
                    this.board[ri][c] = 0;
                    let rf = ri;
                    while (rf > 0 && this.board[rf][c] == 0 && this.board[rf - 1][c] == 0) {
                        rf--;
                    }

                    if (rf > 0 && this.board[rf - 1][c] == v && !mergedLast) {
                        this.board[rf - 1][c] = v + 1;
                        mergedLast = true;
                    } else {
                        this.board[rf][c] = v;
                        mergedLast = false;
                    }
                }
            }
        } else if (move == "down") {
            for (let c = 0; c < n; c++) {
                let mergedLast = false;
                for (let ri = n - 2; ri >= 0; ri--) {
                    const v = this.board[ri][c];
                    this.board[ri][c] = 0;
                    let rf = ri;
                    while (rf < n - 1 && this.board[rf][c] == 0 && this.board[rf + 1][c] == 0) {
                        rf++;
                    }

                    if (rf < n - 1 && this.board[rf + 1][c] == v && !mergedLast) {
                        this.board[rf + 1][c] = v + 1;
                        mergedLast = true;
                    } else {
                        this.board[rf][c] = v;
                        mergedLast = false;
                    }
                }
            }
        } else if (move == "left") {
            for (let r = 0; r < n; r++) {
                let mergedLast = false;
                for (let ci = 1; ci < n; ci++) {
                    const v = this.board[r][ci];
                    this.board[r][ci] = 0;
                    let cf = ci;
                    while (cf > 0 && this.board[r][cf] == 0 && this.board[r][cf - 1] == 0) {
                        cf--;
                    }

                    if (cf > 0 && this.board[r][cf - 1] == v && !mergedLast) {
                        this.board[r][cf - 1] = v + 1;
                        mergedLast = true;
                    } else {
                        this.board[r][cf] = v;
                        mergedLast = false;
                    }
                }
            }
        } else if (move == "right") {
            for (let r = 0; r < n; r++) {
                let mergedLast = false;
                for (let ci = n - 2; ci >= 0; ci--) {
                    const v = this.board[r][ci];
                    this.board[r][ci] = 0;
                    let cf = ci;
                    while (cf < n - 1 && this.board[r][cf] == 0 && this.board[r][cf + 1] == 0) {
                        cf++;
                    }

                    if (cf < n - 1 && this.board[r][cf + 1] == v && !mergedLast) {
                        this.board[r][cf + 1] = v + 1;
                        mergedLast = true;
                    } else {
                        this.board[r][cf] = v;
                        mergedLast = false;
                    }
                }
            }
        }

        this.spawnNewTile();

        return true;
    }

    // Returns whether a number was successfully spawned
    private spawnNewTile(): boolean {
        const blankCoords: [number, number][] = [];

        for (let r = 0; r < n; r++) {
            for (let c = 0; c < n; c++) {
                if (this.board[r][c] == 0) {
                    blankCoords.push([r, c]);
                }
            }
        }

        if (blankCoords.length) {
            this.setPrevBoard();

            const [r, c] = blankCoords[Math.floor(Math.random() * blankCoords.length)];
            // TODO: Should also sometimes be a 4
            this.board[r][c] = 1;

            return true;
        }

        return false;
    }

    private setPrevBoard() {
        this.prevBoard = [];
        this.board.forEach(row => this.prevBoard.push([...row]));
    }
}