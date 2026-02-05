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
    <h2>📋 할 일 목록</h2>
    <p>현재 단계별 진행 상황입니다.</p>
    <ul>
      <li v-for="todo in todos" :key="todo.id">
        <label>
          <input
            type="checkbox"
            :checked="todo.done"
            @change="emit('toggle', todo.id)"
          />
          <span>
            {{ todo.text }}
            <span v-if="todo.done">(완료)</span>
          </span>
        </label>

        <button
          v-if="!todo.done"
          type="button"
          @click="emit('remove', todo.id)"
        >
          삭제
        </button>
      </li>
    </ul>

    <p v-if="todos.length === 0">할 일이 없음</p>
  </section>
</template>
