import { Option, Result } from "@swan-io/boxed";
import { Todo } from "../../entities/todo.entity";

export abstract class TodoRepository {
  abstract findAll(): Todo[];
  abstract findOne(id: string): Option<Todo>;
  abstract save(todo: Todo): Result<Todo, Error>;
  abstract remove(todo: Todo): Result<Todo, Error>;
}
