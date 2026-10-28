<script lang="ts">
	let {
		id,
		class: className = '',
		value = $bindable(),
		'aria-invalid': ariaInvalid,
		required = false,
		minlength,
		placeholder = ''
	}: {
		id: string;
		class?: string;
		value: string;
		'aria-invalid'?: boolean;
		required?: boolean;
		minlength?: number;
		placeholder?: string;
	} = $props();

	let visible = $state(false);
</script>

<div class="pwd-wrap">
	<input
		{id}
		class={className}
		type={visible ? 'text' : 'password'}
		bind:value
		{required}
		{minlength}
		{placeholder}
		aria-invalid={ariaInvalid}
	/>
	<button
		type="button"
		class="pwd-eye"
		onclick={() => (visible = !visible)}
		aria-label={visible ? 'Masquer' : 'Afficher'}
	>
		{#if visible}
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
				stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
			>
				<path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
				<line x1="1" y1="1" x2="23" y2="23"/>
			</svg>
		{:else}
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
				stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
			>
				<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
				<circle cx="12" cy="12" r="3"/>
			</svg>
		{/if}
	</button>
</div>

<style>
	.pwd-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}
	.pwd-wrap input {
		width: 100%;
		padding-right: 2.5rem;
	}
	.pwd-eye {
		position: absolute;
		right: 0.5rem;
		top: 50%;
		transform: translateY(-50%);
		background: none;
		border: none;
		cursor: pointer;
		color: var(--text-muted);
		padding: 0.25rem;
		display: flex;
		align-items: center;
		justify-content: center;
		line-height: 1;
		opacity: 0.6;
		transition: opacity 0.15s;
	}
	.pwd-eye:hover { opacity: 1; }
</style>
