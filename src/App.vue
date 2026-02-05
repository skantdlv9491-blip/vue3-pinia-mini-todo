<script setup lang="ts">
import { computed, watch, ref } from "vue";
import TodoInput from "./components/TodoInput.vue";
import TodoList from "./components/TodoList.vue";
import TodoFilter from "./components/TodoFilter.vue";
import TodoSearch from "./components/TodoSearch.vue";
import TodoSort from "./components/TodoSort.vue";

import type {
  TodoFilter as TodoFilterType,
  TodoSort as TodoSortType,
} from "@/types/todoUi";
import { useTodoStore } from "./stores/todoStore";

const todoStore = useTodoStore();

const filter = ref<TodoFilterType>("all");
const searchText = ref("");
const sort = ref<TodoSortType>("oldset");

const todoView = computed(() => {
  let result = [...todoStore.todos];
  if (filter.value === "active") {
    result = result.filter((t) => !t.done);
  } else if (filter.value === "done") {
    result = result.filter((t) => t.done);
  }

  if (searchText.value.trim()) {
    result = result.filter((t) => t.text.includes(searchText.value));
  }

  if (sort.value === "latest") {
    result.sort((a, b) => b.id - a.id);
  } else if (sort.value === "oldset") {
    result.sort((a, b) => a.id - b.id);
  } else {
    result.sort((a, b) => Number(b.done) - Number(a.done));
  }

  return result;
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
    <h1>4단계: UI 타입 분리 + v-model 패턴 통일</h1>
    <p>{{ counterText }}</p>
    <TodoInput @add="onAdd" />
    <TodoSearch v-model="searchText" />
    <TodoFilter v-model="filter" />
    <TodoSort v-model="sort" />

    <TodoList :todos="todoView" @toggle="onToggle" @remove="onRemove" />

    <button type="button" @click="onClearAll">전체 삭제</button>
  </main>
</template>
