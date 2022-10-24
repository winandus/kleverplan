<script>
    import { link } from "svelte-navigator";
    import Button from "../lib/ui/Button.svelte";
</script>

<section
    class="flex flex-col min-h-screen min-w-full items-center justify-center bg-main"
>
    <div
        class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12"
    >
        <div class="mr-auto place-self-center lg:col-span-7">
            <h1
                class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-white"
            >
                Kleverplan
            </h1>
            <p
                class="max-w-2xl mb-6 font-light lg:mb-8 md:text-lg lg:text-xl text-white/75"
            >
                Blablabla.
            </p>

            <div class="flex gap-4">
                <a
                    use:link
                    href="/register"
                    class="w-full border border-accent bg-accent rounded-full px-6 py-2 text-white hover:cursor-pointer hover:border hober:border-secondary hover:bg-brand hover:text-secondary hover:duration-150 duration-150 disabled:cursor-not-allowed disabled:hover:text-secondary disabled:opacity-30 disabled:hover:bg-transparent"
                >
                    Commencer
                </a>
                <a
                    use:link
                    href="/login"
                    class="w-full border border-accent rounded-full px-6 py-2 text-accent hover:cursor-pointer hover:border hober:border-secondary hover:bg-brand hover:text-secondary hover:duration-150 duration-150 disabled:cursor-not-allowed disabled:hover:text-secondary disabled:opacity-30 disabled:hover:bg-transparent"
                >
                    Connexion
                </a>
            </div>
        </div>
        <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
            <img
                src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png"
                alt="mockup"
            />
        </div>
    </div>
</section>
