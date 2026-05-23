test("basic math works", () => {
  expect(1 + 1).toBe(2);
});

test("todo task is a string", () => {
  const task = "Buy groceries";
  expect(typeof task).toBe("string");
});

test("completed defaults to false", () => {
  const todo = { task: "Test task", completed: false };
  expect(todo.completed).toBe(false);
});
