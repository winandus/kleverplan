<script>
    import { Route, useLocation, useNavigate } from "svelte-navigator";
    import user from "../../store/user-store";
    import Cookies from "js-cookie";

    export let path;
    const navigate = useNavigate();
    const location = useLocation();
    const userCookie = Cookies.get("userToken");

    $: handleRedirection();

    function handleRedirection() {
        if (userCookie === undefined) {
            if ($location.pathname === "/") return;
            navigate("/login", {
                replace: true,
            });
        }
    }
</script>

<Route {path}>
    <slot />
</Route>
