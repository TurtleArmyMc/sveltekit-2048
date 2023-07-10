<script lang="ts">
    import { onMount } from "svelte";
    import { tweened } from "svelte/motion";
    import { cubicIn } from "svelte/easing";
    import { fade, scale } from "svelte/transition";

    import { Game, moveOffset } from "./game";
    import { browser } from "$app/environment";

    let game = new Game();
    const animProgress = tweened(1, {
        duration: 50,
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

    const COLOR_CLASSES = [
        "",
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
    const CELL_SIZE = 50;

    function getColorClass(val: number): string {
        return val < COLOR_CLASSES.length ? COLOR_CLASSES[val] : "cell_big";
    }
</script>

<svelte:window on:keydown={keydown} />

<p>Hello world!</p>
<br />

<div class="game_wrapper">
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

                    <div class="wrapper">
                        {#if cellVal != 0 && tilesMoved >= arriveDist}
                            <div
                                class="cell {getColorClass(cellVal)}"
                                in:scale={{
                                    duration: 100,
                                    easing: (n) => -0.25 * n * (n - 1) + 1,
                                }}
                            >
                                <!-- Local cell -->
                                {2 ** cellVal}
                            </div>
                        {/if}

                        {#if prevVal != 0 && tilesMoved < sendDist}
                            <div
                                class="cell {getColorClass(prevVal)}"
                                style="transform: translate({CELL_SIZE *
                                    cTilesMoved}%, {CELL_SIZE * rTilesMoved}%);"
                            >
                                <!-- Old, moving cell -->
                                {2 ** prevVal}
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>
        {/each}
    </div>
    {#if browser && lost}
        <div class="loss_popup" in:fade><p>You lost!</p></div>
    {/if}
</div>

<style>
    .game_wrapper {
        position: relative;
    }

    .loss_popup {
        background-color: #80808050;
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0px;
        left: 0px;
    }

    .loss_popup p {
        position: absolute;
        top: 50%;
        text-align: center;
    }

    .row {
        display: flex;
    }

    .wrapper {
        height: 40px;
        width: 40px;
        padding: 0px;
        margin: 5px;
        background: hsl(0, 0%, 45%);
        position: relative;
    }

    .cell {
        height: 100%;
        width: 100%;
        top: 0px;
        left: 0px;
        position: absolute;
    }

    .cell2 {
        background: hsl(50, 20%, 80%);
    }
    .cell4 {
        background: hsl(50, 25%, 70%);
    }
    .cell8 {
        background: hsl(35, 100%, 75%);
    }
    .cell16 {
        background: hsl(35, 100%, 60%);
    }
    .cell32 {
        background: hsl(25, 100%, 55%);
    }
    .cell64 {
        background: hsl(25, 98%, 50%);
    }
    .cell128 {
        background: hsl(35, 100%, 75%);
    }
    .cell256 {
        background: hsl(35, 100%, 70%);
    }
    .cell512 {
        background: hsl(45, 100%, 65%);
    }
    .cell1024 {
        background: hsl(45, 100%, 55%);
    }
    .cell2048 {
        background: hsl(35 100% 80%);
    }
    .cell_big {
        /* background: hsl(50, 95%, 55%); */
        background: hsl(0, 0%, 20%);
    }
</style>
