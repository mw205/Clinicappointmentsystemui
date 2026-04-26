<script setup>
const props = withDefaults(defineProps(), {
  delayDuration: 0,
});
export {};
</script>

<template>
  <TooltipProvider v-bind="props">
    <slot />
  </TooltipProvider>
</template>
