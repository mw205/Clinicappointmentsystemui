<script setup>
import { reactiveOmit } from "@vueuse/core";

const props = defineProps();

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <AlertDialogAction v-bind="delegatedProps" :class="cn(buttonVariants(), props.class)">
    <slot />
  </AlertDialogAction>
</template>
