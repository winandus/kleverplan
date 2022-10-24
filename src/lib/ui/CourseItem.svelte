<script lang="ts">
    import {
        dateStringToTimestamp,
        timestampToDateString,
    } from "../../utils/handleDate";
    import { useLocation } from "svelte-navigator";
    import courses from "../../store/courses-store";
    import user from "../../store/user-store";

    import Button from "./Button.svelte";
    import Card from "./Card.svelte";
    import ErrorMessage from "./ErrorMessage.svelte";
    import SuccessMessage from "./SuccessMessage.svelte";
    import Modal from "./Modal.svelte";
    import TextInput from "./TextInput.svelte";
    import { isEmpty } from "../../utils/formValidation";
    import { ADMIN } from "../../constants";
    import { onMount } from "svelte";
    import Spinner from "./Spinner.svelte";

    export let guid: string;
    export let date: string;
    export let address: string;
    export let prof: string;
    export let theme: string;
    export let level: string;
    export let nbSubscriber: string;
    export let comments: string;
    export let me: object;

    let isLoading: boolean = true;
    let isAlreadySubscribed: boolean = false;
    let dateString: string;

    let isModalVisible: boolean = false;
    let subscribeErrorMessage: string | null;
    let subscribeSuccessMessage: string | null;
    let editCourseErrorMessage: string | null;
    let editCourseSuccessMessage: string | null;

    $: isProfValid = !isEmpty(prof);
    $: isScheduleValid = !isEmpty(date.toString());
    $: isAdresseValid = !isEmpty(address);
    $: isThemeValid = !isEmpty(theme);
    $: isLevelValid = !isEmpty(level);
    $: isCommentsValid = !isEmpty(comments);

    onMount(async () => {
        isAlreadySubscribed = await getSubscriptions(me);
        isLoading = false;
        dateString = timestampToDateString(date);
    });

    const location = useLocation();

    $: if (subscribeErrorMessage) {
        setTimeout(() => {
            subscribeErrorMessage = null;
        }, 4000);
    }

    $: if (subscribeSuccessMessage) {
        setTimeout(() => {
            subscribeSuccessMessage = null;
        }, 4000);
    }

    $: if (editCourseErrorMessage) {
        setTimeout(() => {
            editCourseErrorMessage = null;
        }, 4000);
    }

    $: if (editCourseSuccessMessage) {
        setTimeout(() => {
            editCourseSuccessMessage = null;
        }, 4000);
    }

    async function getSubscriptions(user) {
        if (user === undefined) return;
        const subscriptions = await courses.getCourseSubscriptions(guid);
        const isSubscribed = subscriptions.some((item) => {
            return item.guid == user.guid;
        });
        return isSubscribed;
    }

    function toggleModal() {
        isModalVisible = !isModalVisible;
    }

    async function handleSubscribe() {
        const response = await courses.subscribeCourse(guid);
        if (response === 39513) {
            subscribeErrorMessage = "Vous êtes déjà inscrit à ce cours.";
            subscribeSuccessMessage = null;
        } else {
            subscribeErrorMessage = null;
            subscribeSuccessMessage = "Inscription au cours réussie !";
            isAlreadySubscribed = true;
        }
    }

    async function handleUnsubscribe() {
        const response = await courses.unSubscribeCourse(guid);
        if (response === 39513) {
            subscribeErrorMessage = "Vous n'êtes pas inscrit à ce cours.";
            subscribeSuccessMessage = null;
        } else {
            subscribeErrorMessage = null;
            subscribeSuccessMessage = "Vous n'êtes plus inscrit à ce cours.";
            isAlreadySubscribed = false;
        }
    }

    async function editCourse() {
        let formattedDate;
        if (typeof date !== "number") {
            formattedDate = dateStringToTimestamp(date);
        } else {
            formattedDate = date;
        }
        const response = await courses.editCourse(guid, {
            prof,
            schedule_date: formattedDate,
            schedule: formattedDate,
            theme,
            address,
            level,
            comments,
        });
        if (response === undefined) {
            editCourseSuccessMessage = "Le cours a été édité.";
        } else {
            editCourseErrorMessage =
                "Une erreur est survenue lors de l'édition du cours.";
        }
        toggleModal();
    }
</script>

{#if isLoading}
    <Card>
        <div slot="content" class="flex flex-col gap-6">
            <Spinner />
        </div>
    </Card>
{:else}
    <Card>
        <div slot="content" class="flex flex-col gap-6">
            <div>
                <h3 class="text-white text-xl font-bold">
                    {dateString}
                </h3>
                <h4 class="text-white text-lg font-semibold">{address}</h4>
            </div>

            <div>
                <p class="text-white font-medium">
                    Instructeur : <strong>{prof}</strong>
                </p>
                <p class="text-white font-medium">
                    Theme : <strong>{theme}</strong>
                </p>
                <p class="text-white font-medium">
                    Niveau : <strong>{level}</strong>
                </p>
                {#if nbSubscriber === undefined}
                    <p class="text-white font-medium">
                        Participant : <strong>Aucun</strong>
                    </p>
                {:else}
                    <p class="text-white font-medium">
                        Participant(s) : <strong>{nbSubscriber}</strong>
                    </p>
                {/if}
            </div>

            <div>
                <p class="text-white font-medium">
                    {comments}
                </p>
            </div>

            {#if $location.pathname === "/feed" && $user.permissions[1] === "ROLE_USER"}
                <Button
                    tpl={isAlreadySubscribed ? "bordered" : "main"}
                    type="button"
                    label={isAlreadySubscribed
                        ? "Se désinscrire"
                        : "S'inscrire"}
                    on:click={isAlreadySubscribed
                        ? handleUnsubscribe
                        : handleSubscribe}
                />
            {/if}

            {#if $user.permissions[1] === ADMIN}
                <Button type="button" label="Editer" on:click={toggleModal} />
            {/if}
        </div>
    </Card>
{/if}

{#if isModalVisible}
    <Modal on:close-modal={toggleModal}>
        <h3 slot="title" class="text-xl font-semibold text-white">
            Editer un cours
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
                value={dateString}
                placeholder="Date..."
                isValid={isScheduleValid}
                errorMessage={"Veuillez entrer une date pour le cours."}
                on:input={(e) => (date = e.target.value)}
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
            <Button label="Editer" on:click={editCourse} />
        </div>
    </Modal>
{/if}

{#if subscribeErrorMessage}
    <div class="fixed w-full bottom-0 left-0 right-0 z-50 px-4">
        <ErrorMessage message={subscribeErrorMessage} />
    </div>
{/if}

{#if subscribeSuccessMessage}
    <div class="fixed w-full bottom-0 left-0 right-0 z-50 px-4">
        <SuccessMessage message={subscribeSuccessMessage} />
    </div>
{/if}

{#if editCourseErrorMessage}
    <div class="fixed w-full bottom-0 left-0 right-0 z-50 px-4">
        <ErrorMessage message={editCourseErrorMessage} />
    </div>
{/if}

{#if editCourseSuccessMessage}
    <div class="fixed w-full bottom-0 left-0 right-0 z-50 px-4">
        <SuccessMessage message={editCourseSuccessMessage} />
    </div>
{/if}
