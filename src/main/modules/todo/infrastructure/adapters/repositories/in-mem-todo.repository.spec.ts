import { Test } from "@nestjs/testing";
import { Todo } from "../../../domain/entities/todo.entity";
import { InMemoryTodoRepository } from "./in-mem-todo.repository";

describe("InMemTodoRepository", () => {
  let repository: InMemoryTodoRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [InMemoryTodoRepository]
    }).compile();

    repository = moduleRef.get<InMemoryTodoRepository>(InMemoryTodoRepository);
  });

  describe("findOne", () => {
    it("should find the todo by id", () => {
      const expected = repository
        .save(
          Todo.create({
            title: "My super todo",
            description: "flemme"
          })
        )
        .getWithDefault(undefined);

      const result = repository
        .findOne(expected.getId())
        .getWithDefault(undefined);

      expect(result).toBe(expected);
    });
  });
});
