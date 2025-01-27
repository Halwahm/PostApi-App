import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "inmya2",
  e2e: {
    setupNodeEvents(_on, _config) {
      // implement node event listeners here
    }
  }
});
