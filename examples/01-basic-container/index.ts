/**
 * Basic Container Example
 *
 * This example demonstrates the simplest use case:
 * - Creating a Docker host connection
 * - Pulling an image
 * - Running a basic container
 */

import alchemy from "alchemy";
import { Container, Image } from "alchemy/docker/v2";

const app = await alchemy("basic-container-example");

// Pull a simple image
const alpineImage = await Image("alpine.img", {
  ref: "alpine:latest",
});

// Run a basic container
const basicContainer = await Container("my-first-container", {
  image: alpineImage,
  status: "running",
  command: [
    `
    echo "Hello from Alchemy!"
    echo "Container is running..."
    sleep infinity
    `,
  ],
  entrypoint: ["sh", "-c"],
});

await app.finalize();
