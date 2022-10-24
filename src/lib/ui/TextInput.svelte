<script lang="ts">
  export let id:string;
  export let label:string;
  export let type:string = "text";
  export let errorMessage:string = "";
  export let value:string= "";
  export let placeholder:string = "";

  export let isValid:boolean = true;
  export let touched:boolean = false;
  export let isRequired:boolean = true;

  let minDate = ''
  let maxDate = ''
</script>

<div>
    <label class="block text-white text-sm font-semibold mb-2" for={id}>
      {label}
      {#if isRequired}
        *
      {/if}
    </label>
    <input
      {id}
      {type}
      {value}
      {placeholder}
      min={type === "date" ? minDate : null}
      max={type === "date" ? maxDate : null}
      on:input
      on:blur={() => (touched = true)}
      class="bg-main shadow appearance-none rounded-full w-full py-2 px-4 text-white focus:outline-none focus:shadow-outline"
      class:border-red-500={!isValid && touched}
    />
    {#if !isValid && errorMessage && touched}
      <p class="mt-1 text-red-500 text-xs">{errorMessage}</p>
    {/if}
  </div>