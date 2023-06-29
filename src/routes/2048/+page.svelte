<script lang="ts">
    const COLOR_CLASSES = [
        "cell_empty",
        "cell2",
        "cell4",
        "cell8",
        "cell16",
        "cell32",
        "cell64",
        "cell128",
        "cell256",
        "cell512",
        "cell1024",
        "cell2048",
    ];

    import { Game } from "./game";
    let game = new Game();
    let board = game.board;

    function keydown(event: KeyboardEvent) {
        switch (event.key) {
            case "ArrowDown":
                game.makeMove("down");
                board = game.board;
                break;
            case "ArrowUp":
                game.makeMove("up");
                board = game.board;
                break;
            case "ArrowLeft":
                game.makeMove("left");
                board = game.board;
                break;
            case "ArrowRight":
                game.makeMove("right");
                board = game.board;
                break;
            default:
                break;
        }
    }
</script>

<svelte:window on:keydown={keydown} />

<p>Hello world!</p>
<br />

<div class="board">
    {#each board as row}
        <div class="row">
            {#each row as e}
                <div class="cell">
                    <div
                        class={"visible_cell" +
                            (e < COLOR_CLASSES.length
                                ? COLOR_CLASSES[e]
                                : "cell_big")}
                    >
                        {e ? 2 ** e : ""}
                    </div>
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
    }

    .cell_empty {
        background: beige;
    }
    .cell2 {
        background: hsl(35 10% 80%);
    }
    .cell4 {
        background: hsl(35 20% 80%);
    }
    .cell8 {
        background: hsl(35 30% 80%);
    }
    .cell16 {
        background: hsl(35 40% 80%);
    }
    .cell32 {
        background: hsl(35 50% 80%);
    }
    .cell64 {
        background: hsl(35 60% 80%);
    }
    .cell128 {
        background: hsl(35 70% 80%);
    }
    .cell256 {
        background: hsl(35 80% 80%);
    }
    .cell512 {
        background: hsl(35 90% 80%);
    }
    .cell1024 {
        background: hsl(35 100% 80%);
    }
    .cell2048 {
        background: hsl(35 100% 80%);
    }
    .cell_big {
        background: hsl(35 100% 80%);
    }
</style>
