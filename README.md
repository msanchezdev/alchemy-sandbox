# alchemy-sandbox

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.2.15. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

### Scripts

List all docker networks:

```bash
watch -n0.1 'docker network ls -q | xargs -n1 docker network inspect --format "{{.Name}}: {{range .IPAM.Config}}{{.Subnet}}{{end}}"'
```

Watch for network details:

```bash
watch --color -n0.1 'docker network inspect public_1 | yq eval -P -C'
```

Start a container with a specific network:

```bash
docker run --rm --network public_1 -d oven/bun:alpine sh -c "tail -f /dev/null"
```

Start test containers with a specific network:

```bash
for index in {1..3}; do docker run --rm --network public_1 -d --name alchemy-test-$index oven/bun:alpine sh -c "tail -f /dev/null"; done
```

Reconnect containers to a network:

```bash
for index in {1..3}; do docker network connect public_1 alchemy-test-$index ; done
```

List all containers in a network:

```bash
watch -n 0.1 "docker network inspect public_1 -f '{{range .Containers}}{{.Name}}: {{.IPv4Address}}{{\"\n\"}}{{end}}'"
```

List all docker networks and their attachability:

```bash
watch -n0.1 'docker network ls -q | xargs -n1 docker network inspect --format "{{.Name}}: {{.Attachable}}"'
``` 


