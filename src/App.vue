<script setup lang="ts">
import { computed, watch, ref } from "vue";
import TodoInput from "./components/TodoInput.vue";
import TodoList from "./components/TodoList.vue";
import TodoFilter from "./components/TodoFilter.vue";
import type { TodoFilter as TodoFilterType } from "./components/TodoFilter.vue";
import { useTodoStore } from "./stores/todoStore";

const todoStore = useTodoStore();

const filter = ref<TodoFilterType>("all");

const todoView = computed(() => {
  let base = todoStore.todos;
  if (filter.value === "active") {
    base = base.filter((t) => !t.done);
  }
  if (filter.value === "done") {
    base = base.filter((t) => t.done);
  }
  return base;
});

const counterText = computed(() => {
  return `총 ${todoStore.totalCount}개 / 완료 ${todoStore.doneCount}개`;
});

watch(
  () => filter.value,
  (nVal, oVal) => {
    console.log("filter 변경:", oVal, "→", nVal);
  },
);

watch(
  () => todoStore.todos.length,
  (nVal, oVal) => {
    console.log("todos 길이 변경:", oVal, "→", nVal);
  },
);

const onAdd = (text: string) => {
  todoStore.addTodo(text);
};
const onToggle = (id: number) => {
  todoStore.toggleTodo(id);
};
const onRemove = (id: number) => {
  todoStore.removeTodo(id);
};
const onClearAll = () => {
  todoStore.clearAll();
};
</script>

<template>
  <main>
    <h1>Vue3 + TS + Pinia 1단계 (emit -> App -> store -> computed -> 화면)</h1>
    <TodoFilter v-model="filter" />
    <p>{{ counterText }}</p>
    <TodoInput @add="onAdd" />

    <TodoList :todos="todoView" @toggle="onToggle" @remove="onRemove" />

    <button type="button" @click="onClearAll">전체 삭제</button>
  </main>
</template>
