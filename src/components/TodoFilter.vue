<script setup lang="ts">
export type TodoFilter = "all" | "active" | "done";

const props = defineProps<{
  modelValue: TodoFilter;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: TodoFilter): void;
}>();

const setFilter = (value: TodoFilter) => {
  emit("update:modelValue", value);
};

const isSelected = (value: TodoFilter) => {
  return props.modelValue === value;
};
</script>

<template>
  <section>
    <span>필터 : </span>
    <button type="button" @click="setFilter('all')">
      전체<span v-if="isSelected('all')">✅</span>
    </button>
    <button type="button" @click="setFilter('active')">
      미완료<span v-if="isSelected('active')">✅</span>
    </button>
    <button type="button" @click="setFilter('done')">
      완료<span v-if="isSelected('done')">✅</span>
    </button>
  </section>
</template>
