export type Move = "up" | "down" | "left" | "right";


export function moveOffset(move: Move): [number, number] {
    const rOffset = move == "up" ? -1 : move == "down" ? 1 : 0;
    const cOffset = move == "left" ? -1 : move == "right" ? 1 : 0;
    return [rOffset, cOffset];
}

export class Game {
    n: number;
    board: number[][];
    prevBoard: number[][];
    /** How far the tile that was in this position moved away (in tiles) */
    sendDist: number[][];
    /** How far the tile that is now in this position moved to get here (in tiles) */
    arriveDist: number[][];
    prevMove: Move;

    constructor(n: number = 4) {
        this.n = n;
        this.board = [];
        this.prevBoard = [];
        this.sendDist = [];
        this.arriveDist = [];
        for (let i = 0; i < n; i++) {
            this.board.push(Array(n).fill(0));
            this.prevBoard.push(Array(n).fill(0));
            this.sendDist.push(Array(n).fill(0));
            this.arriveDist.push(Array(n).fill(0));
        }
        this.prevMove = "up";
    }

    moveIsValid(move: Move) {
        const [rOffset, cOffset] = moveOffset(move);

        for (let r = 0; r < this.n; r++) {
            for (let c = 0; c < this.n; c++) {
                const v = this.board[r][c];
                if (v == 0) {
                    continue;
                }
                const r2 = r + rOffset;
                const c2 = c + cOffset;
                if (0 <= r2 && 0 <= c2 && r2 < this.n && c2 < this.n) {
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

    makeMove(move: Move): Game | undefined {
        if (!this.moveIsValid(move)) {
            return undefined;
        }

        const newGame = new Game();
        for (let r = 0; r < this.n; r++) {
            for (let c = 0; c < this.n; c++) {
                newGame.board[r][c] = this.board[r][c];
                newGame.prevBoard[r][c] = this.board[r][c];
            }
        }
        newGame.prevMove = move;

        newGame.moveTiles(move);
        newGame.spawnNewTile();

        return newGame;
    }

    private moveTiles(move: Move) {
        if (move == "up") {
            for (let c = 0; c < this.n; c++) {
                let mergedLast = false;
                for (let ri = 0; ri < this.n; ri++) {
                    let v = this.board[ri][c];
                    if (!v) continue; // Skip blank tiles

                    this.board[ri][c] = 0;
                    let rf = ri;
                    while (rf > 0 && this.board[rf - 1][c] == 0) {
                        rf--;
                    }

                    if (rf > 0 && this.board[rf - 1][c] == v && !mergedLast) {
                        rf--;
                        v++;
                        mergedLast = true;
                    } else {
                        mergedLast = false;
                    }
                    this.board[rf][c] = v;
                    this.sendDist[ri][c] = ri - rf;
                    this.arriveDist[rf][c] = ri - rf;
                }
            }
        } else if (move == "down") {
            for (let c = 0; c < this.n; c++) {
                let mergedLast = false;
                for (let ri = this.n - 1; ri >= 0; ri--) {
                    let v = this.board[ri][c];
                    if (!v) continue; // Skip blank tiles

                    this.board[ri][c] = 0;
                    let rf = ri;
                    while (rf < this.n - 1 && this.board[rf + 1][c] == 0) {
                        rf++;
                    }

                    if (rf < this.n - 1 && this.board[rf + 1][c] == v && !mergedLast) {
                        rf++;
                        v++;
                        mergedLast = true;
                    } else {
                        mergedLast = false;
                    }
                    this.board[rf][c] = v;
                    this.sendDist[ri][c] = rf - ri;
                    this.arriveDist[rf][c] = rf - ri;
                }
            }
        } else if (move == "left") {
            for (let r = 0; r < this.n; r++) {
                let mergedLast = false;
                for (let ci = 0; ci < this.n; ci++) {
                    let v = this.board[r][ci];
                    if (!v) continue; // Skip blank tiles

                    this.board[r][ci] = 0;
                    let cf = ci;
                    while (cf > 0 && this.board[r][cf - 1] == 0) {
                        cf--;
                    }

                    if (cf > 0 && this.board[r][cf - 1] == v && !mergedLast) {
                        cf--;
                        v++;
                        mergedLast = true;
                    } else {
                        mergedLast = false;
                    }
                    this.board[r][cf] = v;
                    this.sendDist[r][ci] = ci - cf;
                    this.arriveDist[r][cf] = ci - cf;
                }
            }
        } else if (move == "right") {
            for (let r = 0; r < this.n; r++) {
                let mergedLast = false;
                for (let ci = this.n - 1; ci >= 0; ci--) {
                    let v = this.board[r][ci];
                    if (!v) continue; // Skip blank tiles

                    this.board[r][ci] = 0;
                    let cf = ci;
                    while (cf < this.n - 1 && this.board[r][cf + 1] == 0) {
                        cf++;
                    }

                    if (cf < this.n - 1 && this.board[r][cf + 1] == v && !mergedLast) {
                        cf++;
                        v++;
                        mergedLast = true;
                    } else {
                        mergedLast = false;
                    }
                    this.board[r][cf] = v;
                    this.sendDist[r][ci] = cf - ci;
                    this.arriveDist[r][cf] = cf - ci;
                }
            }
        }
    }

    // Returns whether a number was successfully spawned
    spawnNewTile(): boolean {
        const blankCoords: [number, number][] = [];

        for (let r = 0; r < this.n; r++) {
            for (let c = 0; c < this.n; c++) {
                if (this.board[r][c] == 0) {
                    blankCoords.push([r, c]);
                }
            }
        }

        if (blankCoords.length) {
            const [r, c] = blankCoords[Math.floor(Math.random() * blankCoords.length)];
            // 90% chance of spawning a 2, with a 10% chance of spawning a 4
            const val = Math.random() < 0.9 ? 1 : 2;
            this.board[r][c] = val;
            return true;
        }

        return false;
    }
}