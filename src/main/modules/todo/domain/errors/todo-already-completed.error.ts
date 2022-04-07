import { Todo } from "../entities/todo.entity";

export class TodoAlreadyCompletedError extends Error {
  constructor(todo: Todo) {
    super(`${todo.getTitle()} already completed.`);
  }
}
