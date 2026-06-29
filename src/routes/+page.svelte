<script>
    import { onMount } from 'svelte';
    import Stats from '$lib/components/stats.svelte';
    import ProductCard from '$lib/components/product-card.svelte';
    let { data } = $props();
    /** @type {HTMLCanvasElement} */
    let canvas;
    const spinSpeed = 5;

    function init() {
        const THREE = /** @type {any} */ (window).THREE;
        if (!canvas || !THREE) return;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.set(0, 0, 5.4);

        scene.add(new THREE.AmbientLight(0xfff1d8, 0.8));
        const key = new THREE.DirectionalLight(0xffffff, 1.15); key.position.set(3, 4, 5); scene.add(key);
        const rim = new THREE.DirectionalLight(0xff8a3a, 0.55); rim.position.set(-4, -2, -3); scene.add(rim);

        const group = new THREE.Group();
        scene.add(group);
        /** @type {any[]} */
        const objs = [];
        /** @param {any} geo @param {any} mat @param {number[]} pos @param {number[]} spin */
        const add = (geo, mat, pos, spin) => {
            const m = new THREE.Mesh(geo, mat);
            m.position.set(pos[0], pos[1], pos[2]);
            m.userData.spin = spin;
            group.add(m); objs.push(m);
        };

        // coque solide — rust
        add(new THREE.IcosahedronGeometry(0.98, 0),
            new THREE.MeshStandardMaterial({ color: 0xb5431c, roughness: 0.45, metalness: 0.15, flatShading: true }),
            [0, 0, 0], [0.003, 0.005, 0]);
        // filaire extérieur — amber
        add(new THREE.IcosahedronGeometry(1.34, 0),
            new THREE.MeshBasicMaterial({ color: 0xe0982f, wireframe: true }),
            [0, 0, 0], [-0.0016, 0.003, 0]);
        // noyau intérieur — mustard
        add(new THREE.IcosahedronGeometry(0.36, 0),
            new THREE.MeshStandardMaterial({ color: 0xd98a1f, roughness: 0.4, metalness: 0.2, flatShading: true, emissive: 0x3a1c08 }),
            [0, 0, 0], [0.006, -0.004, 0]);

        let tx = 0, ty = 0, px = 0, py = 0, t = 0;
        /** @param {PointerEvent} e */
        const onMove = (e) => {
            const r = canvas.getBoundingClientRect();
            tx = (e.clientX - r.left) / r.width - 0.5;
            ty = (e.clientY - r.top) / r.height - 0.5;
        };
        canvas.addEventListener('pointermove', onMove);

        const resize = () => {
            const w = canvas.clientWidth || 1, h = canvas.clientHeight || 1;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
        };
        const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

        /** @type {number} */
        let raf;
        let alive = true;
        const loop = () => {
            if (!alive || !document.contains(canvas)) return;
            raf = requestAnimationFrame(loop);
            t += 0.016;
            px += (tx - px) * 0.05; py += (ty - py) * 0.05;
            group.rotation.y = px * 0.55;
            group.rotation.x = py * 0.4;
            group.position.y = Math.sin(t * 0.6) * 0.09;
            for (const o of objs) {
                o.rotation.x += o.userData.spin[0] * spinSpeed;
                o.rotation.y += o.userData.spin[1] * spinSpeed;
                o.rotation.z += (o.userData.spin[2] || 0) * spinSpeed;
            }
            renderer.render(scene, camera);
        };
        loop();

        // cleanup
        return () => {
            alive = false;
            if (raf) cancelAnimationFrame(raf);
            ro.disconnect();
            canvas.removeEventListener('pointermove', onMove);
            try { renderer.dispose(); } catch (e) {}
        };
    }

    onMount(() => {
        /** @type {(() => void) | undefined} */
        let cleanup;
        let tries = 0;
        const waitThree = () => {
            if (/** @type {any} */ (window).THREE) { cleanup = init() || undefined; return; }
            if (tries++ > 80) return;
            setTimeout(waitThree, 100);
        };
        waitThree();
        return () => cleanup && cleanup();
    });
</script>

<svelte:head>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
</svelte:head>

<hero>
    <div>
        <p class="section-index">// MISSION 001 - Déploiment IA</p>
        <h1>
            Le futur s'invite chez vous
        </h1>
        <p>Hellios conçoit, déploie et documente des agents IA sur-mesure pour les entreprises qui migrent. En abonnement, au forfait, ou à l'heure — toujours livré avec sa doc.</p>
        <div class="button-container">
            <a href="/project" class="cta">Démarrer un projet →</a>
            <a href="/catalogue" class="cta-light">Voir le catalogue</a>
        </div>
    </div>

    
    <div data-dc-tpl="35" style="position: relative; border: 2px solid rgb(44, 33, 24); border-radius: 14px; overflow: hidden; background: rgb(28, 20, 13); min-width: 0px; display: flex; flex-direction: column; box-shadow: rgb(44, 33, 24) 8px 8px 0px 0px; margin:1rem;" data-om-id="aea6ae86:39">
      <div data-dc-tpl="45" style="position: relative; aspect-ratio: 8 / 5; min-width: 0px; border-bottom: 1px solid rgb(74, 58, 40);" data-om-id="aea6ae86:49">
        <div data-dc-tpl="46" style="position: absolute; inset: 0px; background-image: linear-gradient(rgba(224, 152, 47, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(224, 152, 47, 0.08) 1px, transparent 1px); background-size: 34px 34px;" data-om-id="aea6ae86:50"></div>
        <div class="hero-visual">
            <canvas bind:this={canvas}></canvas>
        </div>
      </div>
      <div data-dc-tpl="53" style="background: rgb(28, 20, 13); padding: 18px 18px 19px; font-family: &quot;JetBrains Mono&quot;, monospace; font-size: 12.5px; line-height: 1.72; display: flex; flex-direction: column; gap: 1px;" data-om-id="aea6ae86:57">
        <div data-dc-tpl="54" style="color: rgb(224, 152, 47);" data-om-id="aea6ae86:58">&gt; symios init --client</div>
        <div data-dc-tpl="55" style="color: rgb(159, 179, 122);" data-om-id="aea6ae86:59">✓ audit des systèmes legacy</div>
        <div data-dc-tpl="56" style="color: rgb(159, 179, 122);" data-om-id="aea6ae86:60">✓ agent déployé en 14 jours</div>
        <div data-dc-tpl="57" style="color: rgb(159, 179, 122);" data-om-id="aea6ae86:61">✓ documentation livrée</div>
        <div data-dc-tpl="58" style="color: rgb(224, 152, 47);" data-om-id="aea6ae86:62">&gt; modes : abonnement · forfait · à l'heure</div>
        <div data-dc-tpl="59" style="color: rgb(159, 179, 122);" data-om-id="aea6ae86:63">✓ open-source friendly</div>
        <div data-dc-tpl="60" style="color: rgb(182, 168, 134); margin-top: 2px;" data-om-id="aea6ae86:64">symios:~$ <span data-dc-tpl="61" style="display: inline-block; width: 8px; height: 13px; background: rgb(224, 152, 47); vertical-align: -2px; animation: 1.1s steps(1) infinite symios-blink;" data-om-id="aea6ae86:65"></span></div>
      </div>
    </div>
</hero>
<Stats
    stats={[
        { number: '15+', title: 'Projets' },
        { number: '10', title: 'Missions réalisées' },
        { number: '100%', title: 'Uptime' },
        { number: '24/7', title: 'Support' }
    ]}
/>
<section class="catalog">
    <p class="section-index">// MISSION 002 - Le catalogue</p>
    <h2> Travaillons ensemble </h2>
    <a href="/shop">Tout le catalogue →</a>
    {#if data.showcase.length}
        <div class="showcase">
            {#each data.showcase as article (article.id)}
                <ProductCard {article} authenticated={data.authenticated} />
            {/each}
        </div>
    {/if}
</section>
<section class="protocol">
    <p class="section-index">// MISSION 003 - Protocole de mission</p>
    <div class="four-steps">
        <div class="bloc" style="border:none">
            <span class="index">01</span>
            <h4>AUDIT</h4>
            <p>On cartographie vos systèmes et vos objectifs de migration.</p>
        </div>
        <div class="bloc">
            <span class="index">02</span>
            <h4>Conception</h4>
            <p>Architecture de l'agent, choix des modèles, plan de déploiement.</p>
        </div>
        <div class="bloc">
            <span class="index">03</span>
            <h4>Déploiement</h4>
            <p>Mise en production, intégration à vos outils, tests réels.</p>
        </div>
        <div class="bloc">
            <span class="index">04</span>
            <h4>Documentation</h4>
            <p>Tout est documenté et transmis. Vos équipes restent autonomes.</p>
        </div>
    </div>
</section>
<style>
    hero{
        display:grid;
        grid-template-columns: minmax(0px, 1.04fr) minmax(0px, 0.96fr);
        padding: 2rem;
    }
    hero > div:first-child {
        display:flex;
        flex-direction:column;
        justify-content:space-between;
        padding:2rem 0;
    }
    .hero-visual{
        position:relative;
        aspect-ratio:8/5;
        min-width:0;
    }
    .hero-visual > canvas{
        position:absolute;
        inset:0;
        width:100%;
        height:100%;
        display:block;
    }
    .catalog{
        padding: 2rem;
        display: flex;
        flex-direction: column;
        gap:1rem;
    }
    .showcase{
        display:grid;
        grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
        gap:24px;
        align-items:start;
        margin:0.5rem 0 1rem;
    }
    .catalog > a{
        font-family: 'subtext', serif;
        border-bottom: 2px solid var(--accent);
        width: fit-content;
        text-transform: uppercase;
        font-size:13px;
    }
    .protocol{
        padding:2rem;
        display: flex;
        flex-direction: column;
        gap:1rem;
    }
    .four-steps{
        display: flex;
        background-color: var(--background);
        border-radius: var(--bigger-radius);
        border: var(--line) solid black;
    }
    .bloc{
        display:flex;
        flex-direction:column;
        gap:1rem;
        padding:2rem;
        border-left: var(--line) solid black;
    }
    .bloc > p {
        font-size:13.5px;
    }
    .index {
        font-size: 36px;
        font-weight: 800;
        color:var(--accent);
        font-family: 'artistic', serif;
    }
</style>
