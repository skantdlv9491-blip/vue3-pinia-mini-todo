import { defineStore } from "pinia";

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export const useTodoStore = defineStore("todo", {
  state: () => ({ todos: [] as Todo[], nextId: 1 as number }),
  getters: {
    doneCount: (state) => state.todos.filter((t) => t.done).length,
    totalCount: (state) => state.todos.length,
  },
  actions: {
    addTodo(text: string) {
      const trimmed = text.trim();
      if (!trimmed) {
        return;
      }

      const todo: Todo = {
        id: this.nextId,
        text: trimmed,
        done: false,
      };
      this.todos.push(todo);
      this.nextId += 1;
    },
    toggleTodo(id: number) {
      const target = this.todos.find((t) => t.id === id);
      if (!target) {
        return;
      }
      target.done = !target.done;
    },
    removeTodo(id: number) {
      this.todos = this.todos.filter((t) => t.id !== id);
    },
    clearAll() {
      this.todos = [];
    },
  },
});
