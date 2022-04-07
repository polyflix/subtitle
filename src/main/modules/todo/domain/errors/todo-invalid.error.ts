export class TodoInvalidError extends Error {
  constructor() {
    super(
      `The todo is invalid. The title must be defined and the todo should not be completed to be valid.`
    );
  }
}
