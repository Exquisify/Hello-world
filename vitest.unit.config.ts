import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: { "@": process.cwd() },
  },
  test: {
    environment: "node",
    include: ["hooks/**/*.test.{js,ts}", "lib/**/*.test.{js,ts}"],
  },
});
