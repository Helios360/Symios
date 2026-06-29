<script lang="ts">
    type Stat = { number: string; title: string };

    let { stats = [] as Stat[] } = $props();
</script>

<section class="stats">
    <div class="stats-inner">
        {#each stats as stat}
            <div class="stat">
                <span class="number">{stat.number}</span>
                <span class="title">{stat.title}</span>
            </div>
        {/each}
    </div>
</section>

<style>
    .stats {
        width: 100vw;
        margin-inline: calc(50% - 50vw);
        min-height: 120px;
        background-color: var(--background-accent);
        border-top: var(--line) solid black;
        border-bottom: var(--line) solid black;
    }
    .stats-inner {
        max-width: 1440px;
        min-height: 120px;
        margin-inline: auto;
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: 1fr;
    }
    .stat {
        display: flex;
        flex-direction: column;
        align-items: left;
        justify-content: center;
        padding-left: 2rem;
        gap:0.5rem;
        border-left: 1px solid var(--text-color);
    }
    .stats-inner > div:first-child {
        border-left: none;
    }
    .number {
        font-size: 36px;
        font-weight: 800;
        color:var(--accent);
        font-family: 'artistic', serif;
    }
    .title {
        font-size: 0.8rem;
        opacity: 0.8;
        font-family: "details", serif;
        text-transform: uppercase;
    }
</style>
