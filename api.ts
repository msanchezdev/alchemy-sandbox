import { createDockerApi } from "alchemy/docker/api";
import { DateTime } from "luxon";
import { inspect } from "node:util";

const api = createDockerApi();
const images = await api.images.list({
  filters: {
    // dangling: ['false'],
    // dangling: true,

    // reference: ['oven/bun', 'postgres'],
    // reference: '*:1?.*',
    
    // before: ["oven/bun:1.2.6-alpine", "postgres:14.1"],
    // before: ["oven/bun:1.2.6-alpine"],

    // since: ["oven/bun:1.2.6-alpine", "postgres:14.1"],
    // since: ["oven/bun:1.2.6-alpine"],

    // until: DateTime.now().minus({ month: 2 }).toJSDate(),
    // until: DateTime.now().minus({ month: 2 }).toUnixInteger(),
    // until: DateTime.now().minus({ month: 2 }).toISODate(),
    // until: DateTime.now().minus({ month: 2 }).toISO(),

    // label: {
    //   // "org.opencontainers.image.title": "bun",
    //   // "org.opencontainers.image.created": new Date("2025-03-25T08:05:37.761Z"),
    // },
  },
  digests: false
});

console.log(inspect(images));
console.log(inspect(images.length));
