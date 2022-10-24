<script lang="ts">
    import Button from "../lib/ui/Button.svelte";
    import CourseItem from "../lib/ui/CourseItem.svelte";
    import Layout from "../lib/ui/Layout.svelte";
    import user from "../store/user-store";
    import courses from "../store/courses-store";
    import { onMount } from "svelte";
    import Spinner from "../lib/ui/Spinner.svelte";
    import Modal from "../lib/ui/Modal.svelte";
    import TextInput from "../lib/ui/TextInput.svelte";
    import { isEmpty } from "../utils/formValidation";
    import { dateToTimestamp } from "../utils/handleDate";
    import ErrorMessage from "../lib/ui/ErrorMessage.svelte";
    import SuccessMessage from "../lib/ui/SuccessMessage.svelte";
    import { ADMIN } from "../constants";

    let me;

    onMount(async () => {
        me = await user.getMe();
        await getCourses();
    });

    let prof: string = "";
    let schedule: string = "";
    let theme: string = "";
    let address: string = "";
    let level: string = "";
    let comments: string = "";
    let addCourseErrorMessage: string | null;
    let addCourseSuccessMessage: string | null;
    let isModalVisible: boolean = false;

    $: isProfValid = !isEmpty(prof);
    $: isScheduleValid = !isEmpty(schedule);
    $: isAdresseValid = !isEmpty(address);
    $: isThemeValid = !isEmpty(theme);
    $: isLevelValid = !isEmpty(level);
    $: isCommentsValid = !isEmpty(comments);

    $: isLoading = true;

    $: if (addCourseErrorMessage) {
        setTimeout(() => {
            addCourseErrorMessage = null;
        }, 4000);
    }

    $: if (addCourseSuccessMessage) {
        setTimeout(() => {
            addCourseSuccessMessage = null;
        }, 4000);
    }

    function toggleModal() {
        isModalVisible = !isModalVisible;
    }

    async function getCourses() {
        await courses.getCourses();
        isLoading = false;
    }

    async function addCourse() {
        const timestamp = dateToTimestamp(schedule);
        const response = await courses.addCourse({
            prof,
            schedule: timestamp,
            theme,
            address,
            level,
            comments,
        });
        if (response === true) {
            addCourseSuccessMessage = "Le cours a été ajouté.";
            addCourseErrorMessage = null;
        } else {
            addCourseErrorMessage =
                "Une erreur est survenue lors de l'ajout du cours.";
            addCourseSuccessMessage = null;
        }
        toggleModal();
        prof = "";
        schedule = "";
        theme = "";
        address = "";
        level = "";
        comments = "";
    }
</script>

<Layout>
    <div class="flex flex-col gap-12" slot="content">
        <h1 class="text-3xl text-white font-bold">Hello, {$user.name}</h1>
        {#if $user.permissions[1] === ADMIN}
            <section class="flex flex-col gap-6">
                <h2 class="text-md text-white/75 font-bold uppercase">gerer</h2>
                <div class="flex flex-col gap-4">
                    <Button
                        type="button"
                        label="Ajouter un cours"
                        on:click={toggleModal}
                    />
                </div>
            </section>
        {/if}
        <section class="flex flex-col gap-6">
            <h2 class="text-md text-white/75 font-bold uppercase">
                Prochains cours
            </h2>
            <div class="flex flex-col gap-4">
                {#if isLoading}
                    <Spinner />
                {:else}
                    {#each $courses as course, i}
                        <CourseItem
                            guid={course.guid}
                            date={course.schedule}
                            prof={course.prof}
                            level={course.level}
                            nbSubscriber={course.subscriber_count}
                            theme={course.theme}
                            address={course.address}
                            comments={course.comments}
                            {me}
                        />
                    {/each}
                    {#if $courses.length === 0}
                        <p class="text-center text-white">
                            Pas de cours actuellement.
                        </p>
                    {/if}
                {/if}
            </div>
        </section>
    </div>
</Layout>

{#if isModalVisible}
    <Modal on:close-modal={toggleModal}>
        <h3 slot="title" class="text-xl font-semibold text-white">
            Ajouter un cours
        </h3>
        <form slot="content" class="space-y-8">
            <TextInput
                id="prof"
                label="Instructeur"
                value={prof}
                placeholder="Instructeur..."
                isValid={isProfValid}
                errorMessage={"Veuillez entrer le nom de l'instructeur."}
                on:input={(e) => (prof = e.target.value)}
            />
            <TextInput
                id="schedule"
                type="date"
                label="Date"
                value={""}
                placeholder="Date..."
                isValid={isScheduleValid}
                errorMessage={"Veuillez entrer une date pour le cours."}
                on:input={(e) => (schedule = e.target.value)}
            />
            <TextInput
                id="address"
                label="Adresse"
                value={address}
                placeholder="Adresse..."
                isValid={isAdresseValid}
                errorMessage={"Veuillez entrer une adresse pour le cours."}
                on:input={(e) => (address = e.target.value)}
            />
            <TextInput
                id="theme"
                label="Thème"
                value={theme}
                placeholder="Thème..."
                isValid={isThemeValid}
                errorMessage={"Veuillez entrer un thème pour le cours."}
                on:input={(e) => (theme = e.target.value)}
            />
            <TextInput
                id="level"
                label="Niveau"
                value={level}
                placeholder="Niveau..."
                isValid={isLevelValid}
                errorMessage={"Veuillez entrer un niveau pour le cours."}
                on:input={(e) => (level = e.target.value)}
            />
            <TextInput
                id="comments"
                label="Commentaire"
                value={comments}
                placeholder="Commentaire..."
                isValid={isCommentsValid}
                errorMessage={"Veuillez entrer un commentaire pour le cours."}
                on:input={(e) => (comments = e.target.value)}
            />
        </form>
        <div slot="footer" class="flex w-full justify-end space-x-4">
            <Button tpl="bordered" label="Annuler" on:click={toggleModal} />
            <Button label="Créer" on:click={addCourse} />
        </div>
    </Modal>
{/if}

{#if addCourseErrorMessage}
    <div class="fixed w-full bottom-0 left-0 right-0 z-50 px-4">
        <ErrorMessage message={addCourseErrorMessage} />
    </div>
{/if}

{#if addCourseSuccessMessage}
    <div class="fixed w-full bottom-0 left-0 right-0 z-50 px-4">
        <SuccessMessage message={addCourseSuccessMessage} />
    </div>
{/if}
