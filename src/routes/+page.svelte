<script lang="ts">
    import { onMount } from "svelte";
    import { tweened } from "svelte/motion";
    import { cubicIn } from "svelte/easing";
    import { fade, scale } from "svelte/transition";
    import { browser } from "$app/environment";
    import { Game, moveOffset, type Move } from "./game";

    let game = new Game();
    const animProgress = tweened(1, {
        duration: 70,
        easing: cubicIn,
    });
    $: lost =
        !game.moveIsValid("up") &&
        !game.moveIsValid("down") &&
        !game.moveIsValid("left") &&
        !game.moveIsValid("right");

    onMount(() => {
        game.spawnNewTile();
        game = game;
    });

    function tryMove(move: Move) {
        let newGame = game.makeMove(move);
        if (newGame !== undefined) {
            game = newGame;
            animProgress.set(0, { duration: 0 });
            $animProgress = 1;
        }
    }

    function keydown(event: KeyboardEvent) {
        switch (event.key) {
            case "ArrowDown":
                tryMove("down");
                break;
            case "ArrowUp":
                tryMove("up");
                break;
            case "ArrowLeft":
                tryMove("left");
                break;
            case "ArrowRight":
                tryMove("right");
                break;
        }
    }

    let swipeStartX: number;
    let swipeStartY: number;
    function touchstart(event: TouchEvent) {
        console.log(event);

        swipeStartX = event.changedTouches[0].screenX;
        swipeStartY = event.changedTouches[0].screenY;
    }

    function touchend(event: TouchEvent) {
        console.log(event);

        const xDist = event.changedTouches[0].screenX - swipeStartX;
        const yDist = event.changedTouches[0].screenY - swipeStartY;

        console.log(xDist);
        console.log(yDist);

        if (xDist == 0 && yDist == 0) return;

        if (Math.abs(xDist) > Math.abs(yDist)) {
            tryMove(xDist < 0 ? "left" : "right");
        } else {
            tryMove(yDist < 0 ? "up" : "down");
        }
    }

    // A constant needed to convert translation distances in terms of tiles
    // moved to a translation percent that takes tile margins into account
    const TRANSLATE_MULT = 110;
</script>

<svelte:window on:keydown={keydown} />

<svelte:document
    on:touchstart|preventDefault={touchstart}
    on:touchend|preventDefault={touchend}
/>

<div class="header">
    <b>2048</b>
</div>

<div class="board">
    {#each game.board as row, r}
        {@const [rOffsetMult, cOffsetMult] = moveOffset(game.prevMove)}
        {@const tilesMoved = $animProgress * game.n}
        {@const rTilesMoved = tilesMoved * rOffsetMult}
        {@const cTilesMoved = tilesMoved * cOffsetMult}
        <div class="row">
            {#each row as tileVal, c}
                {@const arriveDist = game.arriveDist[r][c]}
                {@const sendDist = game.sendDist[r][c]}
                {@const prevVal = game.prevBoard[r][c]}

                <div class="board_cell">
                    {#if tileVal != 0 && tilesMoved >= arriveDist}
                        <!-- A tile that is in this position and has finished moving and being merged with -->
                        <div
                            class="tile tile{tileVal}"
                            in:scale={{
                                duration: 100,
                                easing: (n) => -0.25 * n * (n - 1) + 1,
                            }}
                        >
                            <!-- Current local tile -->
                            {tileVal}
                        </div>
                    {:else if prevVal != 0 && sendDist == 0}
                        <!-- A tile that was here and is waiting for the merge animation of the arriving tile -->
                        <div class="tile tile{prevVal}">
                            <!-- Previous tile waiting to get merged -->
                            {prevVal}
                        </div>
                    {/if}

                    {#if prevVal != 0 && tilesMoved < sendDist}
                        <!-- A tile that was moved away and is being animated moving -->
                        <div
                            class="tile tile{prevVal}"
                            style="transform: translate({TRANSLATE_MULT *
                                cTilesMoved}%, {TRANSLATE_MULT *
                                rTilesMoved}%);"
                        >
                            <!-- Old, moving tile -->
                            {prevVal}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
    {/each}
    {#if browser && lost}
        <div class="loss_popup" in:fade><p>Game<br />Over!</p></div>
    {/if}
</div>

<style>
    :root {
        font-family: Arial, sans-serif;
    }

    .header {
        font-size: max(11.25vmin, 22.5px);
        width: max(80vmin, 160px);
        margin: auto;
        padding-bottom: 3vh;
        /* background-color: ; */
    }

    .board {
        width: max(80vmin, 160px);
        height: max(80vmin, 160px);
        padding: max(1vmin, 2px);
        margin: auto;
        border-radius: max(1vmin, 2px);
        background-color: hsl(0, 5%, 62%);
    }

    .loss_popup {
        background-color: #a0a0a0c5;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
        font-size: max(min(20vmin, 200px), 40px);
        text-align: center;
        z-index: 2;
    }

    .row {
        display: flex;
    }

    .board_cell {
        height: max(18vmin, 36px);
        width: max(18vmin, 36px);
        margin: max(1vmin, 2px);
        padding: 0px;
        border-radius: max(1vmin, 2px);
        background: #b3a9a9;
        position: relative;
    }

    .tile {
        height: 100%;
        width: 100%;
        top: 0px;
        left: 0px;
        border-radius: max(1vmin, 2px);
        position: absolute;
        color: white;
        text-align: center;
        font-size: max(9vmin, 18px);
        line-height: 200%;
        font-weight: bold;
        z-index: 1;
    }

    .tile2 {
        background: #eee4da;
        color: black;
    }
    .tile4 {
        background: #ece0c3;
        color: black;
    }
    .tile8 {
        background: #feb588;
    }
    .tile16 {
        background: #f79663;
    }
    .tile32 {
        background: #f77d63;
    }
    .tile64 {
        background: #f76142;
    }
    .tile128 {
        background: #efce73;
    }
    .tile256 {
        background: #e6ca5b;
    }
    .tile512 {
        background: #eeca52;
    }
    .tile1024 {
        background: #eec642;
    }
    .tile2048 {
        background: #e6be29;
    }
    .tile4096 {
        background: #ef696b;
    }
    .tile8192 {
        background: #e74d52;
    }
    .tile16384 {
        background: #de413a;
    }
    .tile32768 {
        background: #73b2d6;
    }
</style>
