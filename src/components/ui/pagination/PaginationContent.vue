<script setup>
import { reactiveOmit } from "@vueuse/core";

const props = defineProps();

const delegatedProps = reactiveOmit(props, "class");
</script>

<template>
  <PaginationList
    v-slot="slotProps"
    data-slot="pagination-content"
    v-bind="delegatedProps"
    :class="cn('flex flex-row items-center gap-1', props.class)"
  >
    <slot v-bind="slotProps" />
  </PaginationList>
</template>
