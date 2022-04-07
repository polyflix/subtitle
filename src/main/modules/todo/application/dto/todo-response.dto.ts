import { Todo } from "../../domain/entities/todo.entity";

export class TodoResponse {
  constructor(
    protected id: string,
    protected title: string,
    protected description: string,
    protected status: string
  ) {}

  public static of(todo: Todo): TodoResponse {
    return new TodoResponse(
      todo.getId(),
      todo.getTitle(),
      todo.getDescription(),
      todo.isCompleted() ? "DONE" : "TODO"
    );
  }
}
