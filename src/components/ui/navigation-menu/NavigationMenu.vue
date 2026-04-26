<script setup>
import { reactiveOmit } from "@vueuse/core";
import { useForwardPropsEmits } from "reka-ui";

const props = withDefaults(defineProps(), {
  viewport: true,
});
const emits = defineEmits();

const delegatedProps = reactiveOmit(props, "class", "viewport");
const forwarded = useForwardPropsEmits(delegatedProps, emits);
</script>

<template>
  <NavigationMenuRoot
    v-slot="slotProps"
    data-slot="navigation-menu"
    :data-viewport="viewport"
    v-bind="forwarded"
    :class="cn('group/navigation-menu relative flex max-w-max flex-1 items-center justify-center', props.class)"
  >
    <slot v-bind="slotProps" />
    <NavigationMenuViewport v-if="viewport" />
  </NavigationMenuRoot>
</template>
