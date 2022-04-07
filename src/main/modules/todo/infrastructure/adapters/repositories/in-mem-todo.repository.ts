import { Injectable, Logger } from "@nestjs/common";
import { Option, Result } from "@swan-io/boxed";
import { Todo } from "../../../domain/entities/todo.entity";
import { TodoRepository } from "../../../domain/ports/repositories/todo.repository";

@Injectable()
export class InMemoryTodoRepository extends TodoRepository {
  private readonly logger = new Logger(InMemoryTodoRepository.name);
  private todos: Todo[] = [];

  findOne(id: string): Option<Todo> {
    this.logger.log(`Retrieving todo with id ${id}`);
    return Option.fromNullable(this.todos.find((todo) => todo.getId() === id));
  }

  findAll(): Todo[] {
    this.logger.log(`Retrieving todos`);
    return this.todos;
  }

  save(todo: Todo): Result<Todo, Error> {
    return Result.fromExecution(() => {
      this.logger.log(
        `Creating new todo with title=${todo.getTitle()}, description=${todo.getDescription()}`
      );

      this.findOne(todo.getId()).match({
        Some: (t) => {
          const index = this.todos.indexOf(t);
          this.todos[index] = todo;
        },
        None: () => {
          this.todos.push(todo);
        }
      });

      return todo;
    });
  }

  remove(todo: Todo): Result<Todo, Error> {
    return Result.fromExecution(() => {
      this.logger.log(`Deleting todo with id=${todo.getTitle()}`);
      this.todos = this.todos.filter((t) => t.getId() !== todo.getId());
      return todo;
    });
  }
}
