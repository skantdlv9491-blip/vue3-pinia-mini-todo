<script setup lang="ts">
import type { TodoSort } from "@/types/todoUi";

const props = defineProps<{
  modelValue: TodoSort;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: TodoSort): void;
}>();

const setSort = (value: TodoSort) => {
  emit("update:modelValue", value);
};
const isSelected = (value: TodoSort) => {
  return props.modelValue === value;
};
</script>

<template>
  <section>
    <span>정렬:</span>
    <button @click="setSort('oldset')">
      오래된<span v-if="isSelected('oldset')">✅</span>
    </button>
    <button @click="setSort('latest')">
      최신<span v-if="isSelected('latest')">✅</span>
    </button>
    <button @click="setSort('doneFirst')">
      완료 우선<span v-if="isSelected('doneFirst')">✅</span>
    </button>
  </section>
</template>
