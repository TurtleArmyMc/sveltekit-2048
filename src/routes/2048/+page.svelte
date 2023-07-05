<script lang="ts">
    import { onMount } from "svelte";
    import { tweened } from "svelte/motion";
    import { cubicIn } from "svelte/easing";

    import Cell from "./Cell.svelte";
    import { Game, moveOffset } from "./game";

    let game = new Game();
    const animProgress = tweened(1, {
        duration: 40,
        easing: cubicIn,
    });

    onMount(() => {
        game.spawnNewTile();
        game = game;
    });

    function keydown(event: KeyboardEvent) {
        let newGame = undefined;
        switch (event.key) {
            case "ArrowDown":
                newGame = game.makeMove("down");
                break;
            case "ArrowUp":
                newGame = game.makeMove("up");
                break;
            case "ArrowLeft":
                newGame = game.makeMove("left");
                break;
            case "ArrowRight":
                newGame = game.makeMove("right");
                break;
        }
        console.log(newGame);
        if (newGame !== undefined) {
            game = newGame;
            animProgress.set(0, { duration: 0 });
            $animProgress = 1;
        }
    }
</script>

<svelte:window on:keydown={keydown} />

<p>Hello world!</p>
<br />

<div class="board">
    {#each game.board as row, r}
        {@const [rOffsetMult, cOffsetMult] = moveOffset(game.prevMove)}
        {@const tilesMoved = $animProgress * game.n}
        {@const rTilesMoved = tilesMoved * rOffsetMult}
        {@const cTilesMoved = tilesMoved * cOffsetMult}
        <div class="row">
            {#each row as cellVal, c}
                {@const arriveDist = game.arriveDist[r][c]}
                {@const sendDist = game.sendDist[r][c]}
                {@const prevVal = game.prevBoard[r][c]}
                {@const CELL_SIZE = 50}

                <div class="cell">
                    <!-- Local cell -->
                    <Cell
                        val={cellVal}
                        hidden={cellVal == 0 || tilesMoved < arriveDist}
                    />
                    <!-- Old, moving cell -->
                    <Cell
                        val={prevVal}
                        x={CELL_SIZE * cTilesMoved}
                        y={CELL_SIZE * rTilesMoved}
                        hidden={prevVal == 0 || tilesMoved >= sendDist}
                    />
                </div>
            {/each}
        </div>
    {/each}
</div>

<style>
    .row {
        display: flex;
    }

    .cell {
        height: 40px;
        width: 40px;
        padding: 0px;
        margin: 5px;
        background: beige;
        position: relative;
    }
</style>
