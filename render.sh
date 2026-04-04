#!/bin/bash
set -euo pipefail

PROPS_FILE="${1:-sample-props.json}"
OUTPUT_FILE="${2:-out/video.mp4}"

if [ ! -f "$PROPS_FILE" ]; then
  echo "Error: Props file not found: $PROPS_FILE" >&2
  exit 1
fi

IMAGE_NAME="movie-for-jaws"

# Build Docker image if it doesn't exist
if ! docker image inspect "$IMAGE_NAME" > /dev/null 2>&1; then
  echo "Building Docker image..."
  docker build -t "$IMAGE_NAME" .
fi

mkdir -p "$(dirname "$OUTPUT_FILE")"

docker run --rm \
  -v "$(pwd)/$PROPS_FILE:/app/props.json:ro" \
  -v "$(pwd)/$(dirname "$OUTPUT_FILE"):/app/out" \
  "$IMAGE_NAME" \
  --props=/app/props.json \
  "/app/out/$(basename "$OUTPUT_FILE")"

echo "Rendered: $OUTPUT_FILE"
