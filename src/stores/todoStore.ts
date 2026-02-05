import { defineStore } from "pinia";

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [
      { id: 1, text: "0단계: Pinia 연결 + 화면 갱신 루프 확인 ✅", done: true },
      {
        id: 2,
        text: "1단계: Todo 추가/토글/삭제 (emit→App→store→computed) ✅",
        done: true,
      },
      { id: 3, text: "2단계: 필터(all/active/done) 적용 ✅", done: true },
      { id: 4, text: "3단계: 검색 + 정렬 적용 ✅", done: true },

      { id: 5, text: "4단계: v-model 입력 컴포넌트 리팩토링 ✅", done: true },
      {
        id: 6,
        text: "5단계: URL 쿼리로 상태 유지(필터/검색/정렬)",
        done: false,
      },
      {
        id: 7,
        text: "6단계: json-server API 연동(CRUD) + 로딩/에러",
        done: false,
      },
      {
        id: 8,
        text: "7단계: 페이지네이션/디바운스 등 성능 포인트",
        done: false,
      },
      { id: 9, text: "8단계: 테스트/배포/README 정리", done: false },
    ],
    nextId: 10,
  }),
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
