<script lang="ts">
    import { clickOutside } from "../../utils/clickOutside";
    import user from "../../store/user-store";
    import Button from "./Button.svelte";
    import { useNavigate } from "svelte-navigator";
    import { onMount } from "svelte";
    import TextInput from "./TextInput.svelte";
    import { isEmpty } from "../../utils/formValidation";

    let currentUser;

    onMount(async () => {
        currentUser =  await user.getMe();
    });

    const navigate = useNavigate();

    $: name = currentUser?.name || null;
    $: grade = currentUser?.grade || null;
    let availability = "";

    $: isNameValid = !isEmpty(name);
    $: isGradeValid = !isEmpty(grade);

    let isEditMode: boolean = false;

    let y: number;

    let isDrawerOpen: boolean = false;

    $: if (!isDrawerOpen) isEditMode = false;

    function toggleEditMode() {
        isEditMode = !isEditMode;
    }

    function toggleDrawer() {
        isDrawerOpen = !isDrawerOpen;
    }

    function handleClickOutside() {
        if (!isDrawerOpen) return;
        toggleDrawer();
    }

    function logout() {
        user.logout();
        navigate("/login", {
            replace: true,
        });
    }

    async function editProfile() {
        await user.updateStudent({
            name,
            grade,
            photo: "",
            availability,
        });
        currentUser = await user.getMe();
        toggleEditMode();
    }
</script>

<svelte:window bind:scrollY={y} />

<nav
    class="fixed top-0 left-0 right-0 w-full p-4 bg-main"
    class:shadow-xl={y > 55}
>
    <div class="flex items-center w-full">
        <div class="text-white/75" on:click={toggleDrawer}>
            <i class="fa-solid fa-bars  fa-lg" />
        </div>
    </div>
</nav>

<div
    class="fixed top-0 bottom-0 -left-[100%] w-[80%] flex flex-col gap-6 px-4 pt-12 shadow-2xl bg-mainDarken rounded-tr-[36px] rounded-br-[36px] duration-300"
    class:left-[0]={isDrawerOpen}
    use:clickOutside
    on:click_outside={handleClickOutside}
>
    <div class="absolute right-8 top-6">
        <button on:click={toggleDrawer} class="text-white">
            <i class="fa-solid fa-xmark" />
        </button>
    </div>
    <div class="flex flex-col gap-4">
        <div>
            {#if isEditMode}
                <form action="">
                    <TextInput
                        id="name"
                        type="text"
                        label="Votre prénom"
                        value={name}
                        placeholder="Votre prénom..."
                        isValid={isNameValid}
                        errorMessage={"Veuillez entrer votre prénom."}
                        on:input={(e) => (name = e.target.value)}
                    />
                    <TextInput
                        id="grade"
                        type="text"
                        label="Votre grade"
                        value={grade}
                        placeholder="Votre grade..."
                        isValid={isGradeValid}
                        errorMessage={"Veuillez entrer votre grade."}
                        on:input={(e) => (grade = e.target.value)}
                    />
                </form>
            {:else}
                <p class="text-3xl text-white font-bold">{name}</p>
                {#if currentUser?.grade}
                    <p class="text-xl text-white font-bold">{grade}</p>
                {:else}
                    <p class="text-white">
                        Grade: <span class="text-gray-200/50"
                            >Veuillez renseigner votre grade</span
                        >
                    </p>
                {/if}
            {/if}
        </div>

        <div>
            {#if !isEditMode}
                <Button
                    type="button"
                    label="Editer"
                    tpl="bordered"
                    on:click={toggleEditMode}
                />
            {:else}
                <Button
                    type="button"
                    label="Enregistrer"
                    on:click={editProfile}
                />
            {/if}
        </div>
    </div>

    <div class="absolute bottom-4 left-4 right-4 m-auto">
        <Button
            tpl="danger"
            type="button"
            label="Deconnexion"
            on:click={logout}
        />
    </div>
</div>
