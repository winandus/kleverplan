<script>
    import Header from "./Header.svelte";

</script>

<main class="relative flex flex-col min-h-screen min-w-full bg-main font-mulish overflow-x-hidden">
<Header />
    <div class="p-4 pt-20">
        <slot name="content" />
    </div>
</main>
