<script>
    import { createEventDispatcher } from "svelte";
    import { fade } from "svelte/transition";

    const dispatch = createEventDispatcher();

    function closeModal() {
        dispatch("close-modal");
    }
</script>

<div
    class="fixed z-50 top-0 mt-0 left-0 right-0 w-full h-full bg-mainDarken"
    transition:fade
>
    <header class="flex p-4">
        <slot name="title" />
        <div class="place-self-stretch flex-1" />
        <button on:click={closeModal} class="text-white"
            ><i class="fa-solid fa-xmark" /></button
        >
    </header>
    <div class="p-4">
        <slot name="content" />
    </div>
    <footer class="flex justify-end p-4">
        <slot name="footer" />
    </footer>
</div>
