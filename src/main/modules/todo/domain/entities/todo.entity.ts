import { v4 as uuid } from "uuid";
import { TodoAlreadyCompletedError } from "../errors/todo-already-completed.error";
import { TodoInvalidError } from "../errors/todo-invalid.error";

export interface CreateTodoProps {
  title: string;
  description: string;
}

export class Todo {
  private constructor(
    private readonly id: string,
    private title: string,
    private description: string,
    private completed: boolean
  ) {}

  static create(props: CreateTodoProps): Todo {
    const todo = new Todo(uuid(), props.title, props.description, false);
    if (!todo.validate()) {
      throw new TodoInvalidError();
    }
    return todo;
  }

  validate(): boolean {
    // Here add some logic to validate the domain entity is valid
    // A todo is valid only if the title is not empty and the todo is not completed at the creation
    return this.getTitle() !== "" && !!this.getTitle() && !this.isCompleted();
  }

  /**
   * Complete the todo.
   */
  complete() {
    if (this.completed) {
      throw new TodoAlreadyCompletedError(this);
    }
    this.completed = true;
  }

  getId() {
    return this.id;
  }

  getTitle() {
    return this.title;
  }

  getDescription() {
    return this.description;
  }

  isCompleted(): boolean {
    return this.completed;
  }
}
