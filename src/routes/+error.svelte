<script lang="ts">
    import { page } from "$app/state";
    let data = $props();
</script>
<svelte:head>
    <title>{page.status} - Error</title>
</svelte:head>
<section>
    <h1 style="color:var(--accent)">{page.status}</h1>
    <hr style="width:50%;">
    <h2>{page.error?.message}</h2>
</section>
<style>
    section{
        display:flex;
        flex-direction:column;
        justify-content: center;
        align-items: center;
    }
</style>