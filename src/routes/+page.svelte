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

    function startGame() {
        game = new Game();
        game.spawnNewTile();
        game = game;
    }

    onMount(startGame);

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

<svelte:head><title>2048</title></svelte:head>

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
        <div id="loss_popup" transition:fade>
            <p>Game<br />Over!</p>
            <button on:click={startGame}>
                <svg
                    height="0.5em"
                    width="0.5em"
                    version="1.1"
                    id="Capa_1"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlns:xlink="http://www.w3.org/1999/xlink"
                    viewBox="0 0 303.597 303.597"
                    xml:space="preserve"
                    fill="#000000"
                    ><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g
                        id="SVGRepo_tracerCarrier"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                    ></g><g id="SVGRepo_iconCarrier">
                        <path
                            style="fill:#231F20;"
                            d="M57.866,268.881c25.982,19.891,56.887,30.403,89.369,30.402h0.002c6.545,0,13.176-0.44,19.707-1.308 c39.055-5.187,73.754-25.272,97.702-56.557c14.571-19.033,24.367-41.513,28.329-65.01c0.689-4.084-2.064-7.954-6.148-8.643 l-19.721-3.326c-1.964-0.33-3.974,0.131-5.595,1.284c-1.621,1.153-2.717,2.902-3.048,4.864 c-3.019,17.896-10.49,35.032-21.608,49.555c-18.266,23.861-44.73,39.181-74.521,43.137c-4.994,0.664-10.061,1-15.058,1 c-24.757,0-48.317-8.019-68.137-23.191c-23.86-18.266-39.18-44.73-43.136-74.519c-3.957-29.787,3.924-59.333,22.189-83.194 c21.441-28.007,54.051-44.069,89.469-44.069c24.886,0,48.484,7.996,68.245,23.122c6.55,5.014,12.43,10.615,17.626,16.754 l-36.934-6.52c-1.956-0.347-3.973,0.101-5.604,1.241c-1.631,1.141-2.739,2.882-3.085,4.841l-3.477,19.695 c-0.72,4.079,2.003,7.969,6.081,8.689l88.63,15.647c0.434,0.077,0.869,0.114,1.304,0.114c1.528,0,3.031-0.467,4.301-1.355 c1.63-1.141,2.739-2.882,3.084-4.841l15.646-88.63c0.721-4.079-2.002-7.969-6.081-8.69l-19.695-3.477 c-4.085-0.723-7.97,2.003-8.689,6.082l-6.585,37.3c-7.387-9.162-15.87-17.463-25.248-24.642 c-25.914-19.838-56.86-30.324-89.495-30.324c-46.423,0-89.171,21.063-117.284,57.787C6.454,93.385-3.878,132.123,1.309,171.178 C6.497,210.236,26.583,244.933,57.866,268.881z"
                        ></path>
                    </g></svg
                >
            </button>
        </div>
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

    #loss_popup {
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

    #loss_popup p {
        margin-bottom: 0;
    }

    #loss_popup button {
        width: 0.7em;
        height: 0.7em;
        padding: 0.1em;
        border-radius: 100%;
        cursor: pointer;
        font-size: max(min(20vmin, 200px), 40px);
        background: none;
        border-style: none;
        background-color: #ffffff00;
        transition: cubic-bezier(0.075, 0.82, 0.165, 1);
        transition-duration: 0.5s;
    }

    #loss_popup button:hover,
    #loss_popup button:active {
        background-color: hsla(0, 0%, 40%, 0.5);
    }

    #loss_popup svg {
        display: block;
        height: 0.5em;
        width: 0.5em;
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
        font-size: max(8vmin, 16px);
        line-height: 210%;
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
