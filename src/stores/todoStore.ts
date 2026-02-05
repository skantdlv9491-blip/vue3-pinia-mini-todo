// src/stores/todoStore.ts
// ============================================
// [Pinia Store - json-server API 연동]
// - 서버가 "진짜 원본" (Source of Truth)
// - store.action에서만 fetch를 수행
//
// ✅ 흐름
// App -> store.action -> API 호출 -> state 변경 -> computed -> 화면 갱신
//
// ✅ 404 처리 이유(중요)
// - 서버(db.json)가 리셋되었거나(서버 재시작)
// - 클라이언트 state가 잠깐 서버와 불일치할 수 있음
// - 이때 DELETE/PATCH가 404를 주면
//   "서버에는 이미 없다"로 보고 클라이언트도 정리하는 방식이 UX에 좋음
// ============================================

import { defineStore } from "pinia";

export interface Todo {
  id: number;
  text: string;
  done: boolean;
}

const API_URL = "http://localhost:3001/todos";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [] as Todo[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    totalCount: (state) => state.todos.length,
    doneCount: (state) => state.todos.filter((t) => t.done).length,
  },

  actions: {
    // ==========================
    // 전체 조회
    // ==========================
    async fetchTodos() {
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error(`목록 조회 실패 (${res.status})`);
        this.todos = await res.json();
      } catch (e) {
        this.error = (e as Error).message;
      } finally {
        this.loading = false;
      }
    },

    // ==========================
    // 추가
    // ==========================
    async addTodo(text: string) {
      const trimmed = text.trim();
      if (!trimmed) return;

      this.loading = true;
      this.error = null;

      try {
        const res = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: trimmed, done: false }),
        });
        if (!res.ok) throw new Error(`추가 실패 (${res.status})`);

        const created: Todo = await res.json();

        // 서버가 준 id를 그대로 사용해야 이후 PATCH/DELETE가 정확해짐
        this.todos.push(created);
      } catch (e) {
        this.error = (e as Error).message;
      } finally {
        this.loading = false;
      }
    },

    // ==========================
    // 토글 (PATCH)
    // ==========================
    async toggleTodo(id: number) {
      const target = this.todos.find((t) => t.id === id);
      if (!target) return;

      this.loading = true;
      this.error = null;

      // 서버에 보낼 다음 상태
      const nextDone = !target.done;

      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ done: nextDone }),
        });

        // ✅ 서버에 없으면(404) "이미 없어졌거나 서버 리셋" 가능성이 큼
        if (res.status === 404) {
          // 클라이언트에서도 제거해서 불일치 해소
          this.todos = this.todos.filter((t) => t.id !== id);

          // 필요하면 전체 재동기화도 가능(선택)
          // await this.fetchTodos()
          return;
        }

        if (!res.ok) throw new Error(`토글 실패 (${res.status})`);

        // 성공이면 로컬 state 반영
        target.done = nextDone;
      } catch (e) {
        this.error = (e as Error).message;
      } finally {
        this.loading = false;
      }
    },

    // ==========================
    // 삭제 (DELETE)
    // ==========================
    async removeTodo(id: number) {
      this.loading = true;
      this.error = null;

      try {
        const res = await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
        });

        // ✅ 서버에 없으면(404) "이미 삭제됨"으로 보고 로컬도 정리
        if (res.status === 404) {
          this.todos = this.todos.filter((t) => t.id !== id);

          // 필요하면 전체 재동기화도 가능(선택)
          // await this.fetchTodos()
          return;
        }

        if (!res.ok) throw new Error(`삭제 실패 (${res.status})`);

        // 성공이면 로컬에서도 제거
        this.todos = this.todos.filter((t) => t.id !== id);
      } catch (e) {
        this.error = (e as Error).message;
      } finally {
        this.loading = false;
      }
    },
  },
});
