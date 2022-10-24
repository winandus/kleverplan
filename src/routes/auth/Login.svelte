<script lang="ts">
    import { link, useNavigate } from "svelte-navigator";
    import TextInput from "../../lib/ui/TextInput.svelte";
    import Card from "../../lib/ui/Card.svelte";
    import { isEmpty, isValidEmail } from "../../utils/formValidation";
    import Button from "../../lib/ui/Button.svelte";
    import user from "../../store/user-store";
    import Error from "../../lib/ui/ErrorMessage.svelte";

    const navigate = useNavigate();

    let isFormValid: boolean = false;
    let emailAddress: string = "";
    let password: string = "";
    let loginErrorMessage: string | null;

    $: isEmailAddressValid = isValidEmail(emailAddress);
    $: isPaswordValid = !isEmpty(password);
    $: isFormValid = isEmailAddressValid && isPaswordValid;

    $: if ($user !== null) {
        navigate("/feed", {
            replace: true,
        });
    }

    async function handleSubmit() {
        const response = await user.login(emailAddress, password);
        if (response === 16873154) {
            loginErrorMessage = "Vos identifiants sont incorrects.";
        } else {
            loginErrorMessage = null;
        }
    }
</script>

<section class="flex flex-col min-h-screen min-w-full bg-main p-4">
    <Card>
        <div slot="content">
            <h1 class="text-xl text-white font-medium">Connexion</h1>
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
                    id="password"
                    type="password"
                    label="Mot de passe"
                    value={password}
                    placeholder="Votre mot de passe..."
                    isValid={isPaswordValid}
                    errorMessage={"Veuillez entrer votre mot de passe."}
                    on:input={(e) => (password = e.target.value)}
                />
                <Button
                    type="submit"
                    label="Connexion"
                    disabled={!isFormValid}
                />
                <div class="text-center">
                    <a
                        class="text-white text-xs font-semibold text-sm text-secondary opacity-75 hover:opacity-100"
                        href="/register"
                        use:link
                    >
                        Vous avez déjà un compte ? Inscrivez-vous
                    </a>
                </div>
            </form>
        </div>
    </Card>
    {#if loginErrorMessage}
        <Error message={loginErrorMessage} />
    {/if}
</section>
