<script lang="ts">
    export let label: string = "";
    export let type: string = "button";
    export let tpl: string = "main";
    export let disabled: boolean = false;
</script>


{#if tpl === 'main'}
<button
    {type}
    on:click
    {disabled}
    class="w-full border border-accent bg-accent rounded-full px-6 py-2 text-white hover:cursor-pointer hover:border hober:border-secondary hover:bg-brand hover:text-secondary hover:duration-150 duration-150 disabled:cursor-not-allowed disabled:hover:text-secondary disabled:opacity-30 disabled:hover:bg-transparent"
    >{label}</button
>
{/if}

{#if tpl === 'bordered'}
<button
    {type}
    on:click
    {disabled}
    class="w-full border border-accent rounded-full px-6 py-2 text-accent hover:cursor-pointer hover:border hober:border-secondary hover:bg-brand hover:text-secondary hover:duration-150 duration-150 disabled:cursor-not-allowed disabled:hover:text-secondary disabled:opacity-30 disabled:hover:bg-transparent"
    >{label}</button
>
{/if}

{#if tpl === 'danger'}
<button
    {type}
    on:click
    {disabled}
    class="w-full border border-red-400 bg-red-400 rounded-full px-6 py-2 text-white hover:cursor-pointer hover:border hober:border-secondary hover:bg-brand hover:text-secondary hover:duration-150 duration-150 disabled:cursor-not-allowed disabled:hover:text-secondary disabled:opacity-30 disabled:hover:bg-transparent"
    >{label}</button
>
{/if}
