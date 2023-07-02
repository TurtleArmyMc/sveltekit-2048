<script lang="ts">
    import Cell from "./Cell.svelte";
    import { onMount } from "svelte";
    import { Game } from "./game";

    let game = new Game();
    $: board = game.board;
    $: moveAway = game.moveAwayDistance;
    $: moveTo = game.moveToDistance;

    onMount(() => {
        game.spawnNewTile();
        game = game;
    });

    function keydown(event: KeyboardEvent) {
        switch (event.key) {
            case "ArrowDown":
                game = game.makeMove("down") ?? game;
                break;
            case "ArrowUp":
                game = game.makeMove("up") ?? game;
                break;
            case "ArrowLeft":
                game = game.makeMove("left") ?? game;
                break;
            case "ArrowRight":
                game = game.makeMove("right") ?? game;
                break;
        }
    }
</script>

<svelte:window on:keydown={keydown} />

<p>Hello world!</p>
<br />

<div class="board">
    {#each board as row, r}
        <div class="row">
            {#each row as e, c}
                <div class="cell">
                    {#if e}
                        <Cell val={e} x={-20} y={-20} />
                        <!-- <Cell val={e} /> -->
                        <Cell val={e} />
                    {/if}
                </div>
                <!-- <div
                    class="cell {e < COLOR_CLASSES.length
                        ? COLOR_CLASSES[e]
                        : 'cell_big'}"
                >
                    {e ? 2 ** e : ""}
                </div> -->
            {/each}
        </div>
    {/each}

    <br>

    <p>Away:</p>
    {#each moveAway as row}
        <div class="row">
            {#each row as e}
                <div class="cell">
                    {#if e}
                        <div>{e}</div>
                    {/if}
                </div>
            {/each}
        </div>
    {/each}

    <br>

    <p>To:</p>
    {#each moveTo as row}
    <div class="row">
        {#each row as e}
            <div class="cell">
                {#if e}
                    <div>{e}</div>
                {/if}
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
