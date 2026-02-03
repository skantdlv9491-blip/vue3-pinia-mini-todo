<script setup lang="ts">
import type { Todo } from "@/stores/todoStore";

defineProps<{
  todos: Todo[];
}>();

const emit = defineEmits<{
  (e: "toggle", id: number): void;
  (e: "remove", id: number): void;
}>();
</script>
<template>
  <section>
    <ul>
      <li v-for="t in todos" :key="t.id">
        <label>
          <input
            type="checkbox"
            :checked="t.done"
            @change="emit('toggle', t.id)"
          />
          <span>
            {{ t.text }}
            <span v-if="t.done">(완료)</span>
          </span>
        </label>

        <button type="button" @click="emit('remove', t.id)">삭제</button>
      </li>
    </ul>

    <p v-if="todos.length === 0">할 일이 없음</p>
  </section>
</template>
