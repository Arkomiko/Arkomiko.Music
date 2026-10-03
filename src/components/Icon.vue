<script setup lang="ts">
import { icons, iconAttrs, type IconName } from '../lib/icons';

const props = withDefaults(defineProps<{ name: IconName; size?: number }>(), { size: 18 });
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    :width="props.size"
    :height="props.size"
    aria-hidden="true"
    v-bind="iconAttrs(props.name)"
    v-html="icons[props.name].body"
  />
</template>
