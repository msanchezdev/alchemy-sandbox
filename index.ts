import alchemy from "alchemy";

const app = await alchemy("sandbox", { password: "1234567890" });

// ------------------------------------------------------------

import { Network as OldNetwork } from "alchemy/docker";
import { DockerHost, Network } from "alchemy/docker/api";

// const publicNetwork = await Network("public_1", {});

// const container = await Container("whoami", {
//   image: "ghcr.io/msanchezdev/alchemy-sandbox/projects/hello-world:1.0.0",
// });

// const helloWorldImage = await Image("hello-world", {
//   name: "alchemy-sandbox/projects/hello-world",
//   tag: "1.0.0",
//   build: {
//     context: "example-projects/hello-world",
//   },
//   skipPush: false,
//   registry: {
//     username: "msanchezdev",
//     password: alchemy.secret("Welc0me123."),
//     server: "selfhosted-registry:5000",
//   },
// });

const dockerHost = await DockerHost({
  url: "ssh://3.135.10.112:22",
  // url: "tcp://localhost:12376",
  // url: "unix:///var/run/docker.sock",
  // registries: [
  //   {
  //     serverAddress: "selfhosted-registry",
  //     username: alchemy.secret.env("REGISTRY_USERNAME"),
  //     password: alchemy.secret.env("REGISTRY_PASSWORD"),
  //   },
  // ],
});

const public_1 = await Network("public_1", {
  ipv4: [
    {
      subnet: "10.33.0.0/16",
      gateway: "10.33.0.1",
      ipRange: "10.33.25.0/24",
    },
  ],
  attachable: false,
  dockerHost,
});

// const oldPublicNetwork = await OldNetwork("public_1", {

// });

// console.log(
//   await host.dockerode
//     .listNetworks()
//     .then((networks) => networks.map((n) => n.Name)),
// );

// console.log(
//   await new Promise((resolve, reject) =>
//     host.dockerode.pull(
//       "ghcr.io/msanchezdev/alchemy-sandbox/projects/hello-world:1.0.0",
//       {
//         authconfig: {
//           serveraddress: "ghcr.io",
//           username: alchemy.secret.env("REGISTRY_USERNAME"),
//           password: alchemy.secret.env("REGISTRY_PASSWORD"),
//         },
//       },
//       (err, stream) => {
//         if (err) return reject(err);
//         host.dockerode.modem.followProgress(stream!, onFinished, onProgress);

//         function onFinished(err: any) {
//           if (err) reject(err);
//           else resolve(void 0);
//         }
//         function onProgress(event: any) {
//           console.log("progress", event.status, "|", event.progress || "");
//         }
//       },
//     ),
//   ),
// );

// console.log(
//   await host.dockerode.pull(
//     "selfhosted-registry:5000/msanchezdev/alchemy-sandbox/projects/hello-world:1.0.0",
//   ),
// );

// const Image = await RemoteImage("hello-world", {
//   name: "alchemy-sandbox/projects/hello-world",
//   tag: "1.0.0",
// });

// alchemy.run("sub-scope", async () => {
//   // const dockerHost2 = await DockerHost("docker2", {
//   //   url: "unix:///var/run/docker2.sock",
//   // });
//   await Network("private");
//   await Network("shared");
// });
// await Network("shared");

// const publicNetwork = await Network("public", {
//   // context: dockerHost,
//   name: "public",
// });
// const privateNetwork = await Network("private", {
//   // context: dockerHost,
//   name: "privates",
// });

// const whoamiImage = await Image("whoami", {

// });

// const whoamiContainer = await Container("whoami", {
//   Network: [publicNetwork, privateNetwork],
//   Image: whoamiImage,
// });

// const nginxContainer = await Container("nginx", {
//   Network: [publicNetwork, privateNetwork],
//   Image: nginxImage,
// });

// ------------------------------------------------------------

await app.finalize();
