import alchemy from "alchemy";
import {
  Container,
  DockerHost,
  Image,
  Mount,
  Network,
} from "alchemy/docker/v2";

const app = await alchemy("traefik-example", { password: "1234567890" });

// Create Docker host connection
const dockerHost = await DockerHost();

// Create networks
const publicNetwork = await Network("public_traefik", { dockerHost });
const privateNetwork = await Network("private_traefik", {
  dockerHost,
  internal: true,
});

// Deploy Traefik
const traefikImage = await Image("traefik.img", {
  ref: "traefik:v2.10",
  dockerHost,
});

const traefik = await Container("traefik", {
  image: traefikImage,
  status: "running",
  networking: {
    [publicNetwork.Name]: {},
    [privateNetwork.Name]: {},
  },
  ports: {
    "80/tcp": "80",
    "8080/tcp": "8080", // Dashboard
  },
  volumes: {
    "/var/run/docker.sock": Mount.Bind("/var/run/docker.sock"),
  },
  command: [
    "--api.insecure=true",
    "--providers.docker=true",
    "--providers.docker.exposedbydefault=false",
    "--entrypoints.web.address=:80",
  ],
  dockerHost,
});

// Deploy example service
const whoamiImage = await Image("whoami.img", {
  ref: "traefik/whoami:latest",
  dockerHost,
});

const whoami = await Container("whoami", {
  image: whoamiImage,
  status: "running",
  networking: {
    [privateNetwork.Name]: {},
  },
  labels: {
    "traefik.enable": "true",
    "traefik.http.routers.whoami.rule": "Host(`whoami.localhost`)",
    "traefik.http.routers.whoami.entrypoints": "web",
    "traefik.http.services.whoami.loadbalancer.server.port": "80",
  },
  dockerHost,
});

await app.finalize();
