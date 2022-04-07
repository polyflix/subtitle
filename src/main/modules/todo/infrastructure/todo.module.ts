import { Module } from "@nestjs/common";
import { TodoRepository } from "../domain/ports/repositories/todo.repository";
import { InMemoryTodoRepository } from "./adapters/repositories/in-mem-todo.repository";
import { TodoController } from "./controllers/todo.controller";
import { TodoService } from "./services/todo.service";

@Module({
  controllers: [TodoController],
  providers: [
    { provide: TodoRepository, useClass: InMemoryTodoRepository },
    TodoService
  ]
})
export class TodoModule {}
