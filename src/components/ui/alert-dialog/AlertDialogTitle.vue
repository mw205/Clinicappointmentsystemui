<script setup>
import { reactiveOmit } from "@vueuse/core";

const props = defineProps();

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <AlertDialogTitle
    data-slot="alert-dialog-title"
    v-bind="delegatedProps"
    :class="cn('text-lg font-semibold', props.class)"
  >
    <slot />
  </AlertDialogTitle>
</template>
