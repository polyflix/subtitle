import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnprocessableEntityException
} from "@nestjs/common";
import { Result } from "@swan-io/boxed";
import { TodoResponse } from "../../application/dto/todo-response.dto";
import { CreateTodoProps, Todo } from "../../domain/entities/todo.entity";
import { TodoAlreadyCompletedError } from "../../domain/errors/todo-already-completed.error";
import { TodoInvalidError } from "../../domain/errors/todo-invalid.error";
import { TodoRepository } from "../../domain/ports/repositories/todo.repository";

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  private getTodo(id: string): Todo {
    return this.todoRepository.findOne(id).match({
      Some: (todo) => todo,
      None: () => {
        throw new NotFoundException(`Todo not found with id=${id}`);
      }
    });
  }

  findOne(id: string): TodoResponse {
    return TodoResponse.of(this.getTodo(id));
  }

  find(): TodoResponse[] {
    const todos = this.todoRepository.findAll();
    return todos.map(TodoResponse.of);
  }

  create(props: CreateTodoProps): TodoResponse {
    const todo = Result.fromExecution(() => Todo.create(props)).match({
      Ok: (todo) => todo,
      Error: (error: Error) => {
        switch (error.constructor) {
          case TodoInvalidError:
            throw new UnprocessableEntityException(error.message);
          default:
            throw new InternalServerErrorException(error.message);
        }
      }
    });

    return this.todoRepository.save(todo).match({
      Ok: (todo) => TodoResponse.of(todo),
      Error: (error) => {
        throw error;
      }
    });
  }

  completeTodo(id: string): TodoResponse {
    const todo = this.getTodo(id);

    const completedTodo = Result.fromExecution(() => todo.complete()).match({
      Ok: () => todo,
      Error: (error: Error) => {
        switch (error.constructor) {
          case TodoAlreadyCompletedError:
            throw new UnprocessableEntityException(error.message);
          default:
            throw new InternalServerErrorException(error.message);
        }
      }
    });

    return this.todoRepository.save(completedTodo).match({
      Ok: (todo) => TodoResponse.of(todo),
      Error: (error) => {
        throw error;
      }
    });
  }

  delete(id: string): TodoResponse {
    const todo = this.getTodo(id);
    return this.todoRepository.remove(todo).match({
      Ok: (todo) => TodoResponse.of(todo),
      Error: (error) => {
        throw error;
      }
    });
  }
}
