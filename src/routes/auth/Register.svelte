<script lang="ts">
    import { link, navigate } from "svelte-navigator";
    import TextInput from "../../lib/ui/TextInput.svelte";
    import Card from "../../lib/ui/Card.svelte";
    import {
        comparePasswords,
        isEmpty,
        isValidEmail,
    } from "../../utils/formValidation";
    import Button from "../../lib/ui/Button.svelte";
    import user from "../../store/user-store";
    import Error from "../../lib/ui/ErrorMessage.svelte";

    let isFormValid:boolean = false;
    let emailAddress:string = "";
    let name:string  = "";
    let password:string  = "";
    let repeatedPassword:string  = "";
    let registerErrorMessage: string | null;

    $: isEmailAddressValid = isValidEmail(emailAddress);
    $: isNameValid = !isEmpty(name);
    $: isPaswordValid = !isEmpty(password);
    $: isRepeatedPaswordValid = comparePasswords(password, repeatedPassword);
    $: isFormValid =
        isEmailAddressValid &&
        isNameValid &&
        isPaswordValid &&
        isRepeatedPaswordValid;

    $: if ($user !== null) {
        navigate("/feed", {
            replace: true,
        });
    }
    async function handleSubmit() {
        const response = await user.register(emailAddress, name, password);

        if (response === 89045) {
            registerErrorMessage = "Cet utilisateur existe déjà.";
        } else {
            registerErrorMessage = null;
        }
    }
</script>

<section class="flex flex-col min-h-screen min-w-full bg-main p-4">
    <Card>
        <div slot="content">
            <h1 class="text-xl text-white font-medium">Inscription</h1>
            <form
                class="mt-8 space-y-8"
                on:submit|preventDefault={handleSubmit}
            >
                <TextInput
                    id="email"
                    type="email"
                    label="Adresse email"
                    value={emailAddress}
                    placeholder="Votre adresse email..."
                    isValid={isEmailAddressValid}
                    errorMessage={"Veuillez entrer une adresse email valide."}
                    on:input={(e) => (emailAddress = e.target.value)}
                />
                <TextInput
                    id="name"
                    type="name"
                    label="Prénom"
                    value={name}
                    placeholder="Votre prénom..."
                    isValid={isNameValid}
                    errorMessage={"Veuillez entrer votre prénom."}
                    on:input={(e) => (name = e.target.value)}
                />
                <TextInput
                    id="password"
                    type="password"
                    label="Mot de passe"
                    value={password}
                    placeholder="Votre mot de passe..."
                    isValid={isPaswordValid}
                    errorMessage={"Veuillez entrer votre mot de passe."}
                    on:input={(e) => (password = e.target.value)}
                />

                <TextInput
                    id="repeatPassword"
                    type="password"
                    label="Confirmez votre mot de passe"
                    value={repeatedPassword}
                    placeholder="Votre mot de passe..."
                    isValid={isRepeatedPaswordValid}
                    errorMessage={"Les mots de passe ne correspondent pas."}
                    on:input={(e) => (repeatedPassword = e.target.value)}
                />
                <Button
                    type="submit"
                    label="Inscription"
                    disabled={!isFormValid}
                />
                <div class="text-center">
                    <a
                        class="text-white text-xs font-semibold text-sm text-secondary opacity-75 hover:opacity-100"
                        href="/login"
                        use:link
                    >
                        Vous avez déjà un compte ? Connectez-vous
                    </a>
                </div>
            </form>
        </div>
    </Card>
    {#if registerErrorMessage}
        <Error message={registerErrorMessage} />
    {/if}
</section>
