<script lang="ts">
  import { Router, Route } from "svelte-navigator";
  import PrivateRoute from "./lib/ui/PrivateRoute.svelte";
  import Login from "./routes/auth/Login.svelte";
  import Register from "./routes/auth/Register.svelte";
  import Feed from "./routes/Feed.svelte";
  import Home from "./routes/Home.svelte";
</script>

<Router primary={false}>
  <Route path="/">
    <Home />
  </Route>
  <Route path="/login">
    <Login />
  </Route>
  <Route path="/register">
    <Register />
  </Route>
  <PrivateRoute path="/feed">
    <Feed />
  </PrivateRoute>
</Router>
