<script setup>
import { reactiveOmit } from "@vueuse/core";

const props = defineProps();

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <DialogDescription
    data-slot="sheet-description"
    :class="cn('text-muted-foreground text-sm', props.class)"
    v-bind="delegatedProps"
  >
    <slot />
  </DialogDescription>
</template>
