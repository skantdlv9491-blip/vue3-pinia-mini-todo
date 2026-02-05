<script setup lang="ts">
import { computed, watch, ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

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
const route = useRoute();
const router = useRouter();

const filter = ref<TodoFilterType>("all");
const searchText = ref("");
const sort = ref<TodoSortType>("oldset");

const isTodoFilter = (value: unknown): value is TodoFilterType => {
  return value === "all" || value === "active" || value === "done";
};

const isTodoSort = (value: unknown): value is TodoSortType => {
  return value === "latest" || value === "oldset" || value === "doneFirst";
};

const applyQueryToUiState = (query: Record<string, unknown>) => {
  if (isTodoFilter(query.filter)) {
    filter.value = query.filter;
  } else {
    filter.value = "all";
  }

  if (isTodoSort(query.sort)) {
    sort.value = query.sort;
  } else {
    sort.value = "oldset";
  }

  const q = query.search;
  if (typeof q === "string") {
    searchText.value = q;
  } else {
    searchText.value = "";
  }
};

const buildQueryFromUiState = () => {
  const query: Record<string, string> = {};

  if (filter.value !== "all") {
    query.filter = filter.value;
  }

  if (sort.value !== "oldset") {
    query.sort = sort.value;
  }

  const keyword = searchText.value.trim();
  if (keyword) {
    query.search = keyword;
  }

  return query;
};

applyQueryToUiState(route.query as Record<string, unknown>);

let isSyncingFromUi = false;

watch(
  () => route.query,
  (newQuery) => {
    if (isSyncingFromUi) {
      return;
    }
    applyQueryToUiState(newQuery as Record<string, unknown>);
  },
);

watch(
  [filter, sort, searchText],
  async () => {
    isSyncingFromUi = true;
    await router.replace({ query: buildQueryFromUiState() });
    isSyncingFromUi = false;
  },
  { deep: false },
);

onMounted(() => {
  todoStore.fetchTodos();
});

const todoView = computed(() => {
  let result = [...todoStore.todos];
  if (filter.value === "active") {
    result = result.filter((t) => !t.done);
  } else if (filter.value === "done") {
    result = result.filter((t) => t.done);
  }

  if (searchText.value.trim()) {
    result = result.filter((t) =>
      t.text.toLocaleLowerCase().includes(searchText.value.toLocaleLowerCase()),
    );
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

const onAdd = (text: string) => {
  todoStore.addTodo(text);
};
const onToggle = (id: number) => {
  todoStore.toggleTodo(id);
};
const onRemove = (id: number) => {
  todoStore.removeTodo(id);
};
</script>

<template>
  <main>
    <h1>5단계: URL 쿼리로 UI 상태 유지</h1>
    <p>{{ counterText }}</p>
    <TodoInput @add="onAdd" />
    <TodoSearch v-model="searchText" />
    <TodoFilter v-model="filter" />
    <TodoSort v-model="sort" />

    <TodoList :todos="todoView" @toggle="onToggle" @remove="onRemove" />
  </main>
</template>
