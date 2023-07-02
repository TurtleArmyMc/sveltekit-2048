<script lang="ts">
    export let val: number;
    export let x: number = 0;
    export let y: number = 0;

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
</script>

<div
    class={val < COLOR_CLASSES.length ? COLOR_CLASSES[val] : "cell_big"}
    style="transform: translate({x}%, {y}%);"
>
    {val ? 2 ** val : ""}
</div>

<style>
    div {
        height: 100%;
        width: 100%;
        top: 0px;
        left: 0px;
        position: absolute;
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
