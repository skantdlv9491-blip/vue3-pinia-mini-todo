<script setup lang="ts">
import { ref } from "vue";

const text = ref("");
const onClickAdd = () => {
  emit("add", text.value);
  text.value = "";
};

const emit = defineEmits<{
  (e: "add", text: string): void;
}>();
</script>

<template>
  <section>
    <input
      type="text"
      v-model="text"
      placeholder="할 일을 입력하세요."
      @keyup.enter="onClickAdd"
    />
    <button type="button" @click="onClickAdd">추가</button>
  </section>
</template>
