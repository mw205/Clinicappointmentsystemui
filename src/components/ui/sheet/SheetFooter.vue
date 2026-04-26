<script setup>
const props = defineProps();
export {};
</script>

<template>
  <div
    data-slot="sheet-footer"
    :class="cn('mt-auto flex flex-col gap-2 p-4', props.class)
    "
  >
    <slot />
  </div>
</template>
