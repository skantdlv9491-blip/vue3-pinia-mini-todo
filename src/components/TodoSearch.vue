<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{
  modelValue: string;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
}>();

const localValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit("update:modelValue", value),
});
</script>
<template>
  <section>
    <input type="text" placeholder="검색어 입력" v-model="localValue" />
  </section>
</template>
