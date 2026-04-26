<script setup>
import { reactiveOmit } from "@vueuse/core";

const props = defineProps();
const delegatedProps = reactiveOmit(props, "class", "inset");
</script>

<template>
  <MenubarLabel
    :data-inset="inset ? '' : undefined"
    v-bind="delegatedProps"
    :class="cn('px-2 py-1.5 text-sm font-medium data-[inset]:pl-8', props.class)"
  >
    <slot />
  </MenubarLabel>
</template>
