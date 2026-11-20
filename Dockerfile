FROM node:20-alpine

# OpenAPI Generator CLI needs a JRE
RUN apk add --no-cache openjdk21-jre

WORKDIR /app

COPY demo-app-ui/package*.json ./
RUN npm ci

COPY demo-app-ui/ ./
COPY bff-service/src/main/resources/openapi/bff-api.yml /openapi/bff-api.yml

# generated/ is gitignored — always create it inside the image
RUN npx --yes @openapitools/openapi-generator-cli generate \
  -i /openapi/bff-api.yml \
  -g typescript-fetch \
  -o src/lib/api/generated \
  --additional-properties=supportsES6=true,typescriptThreePlus=true

EXPOSE 3001
CMD ["npx", "next", "dev", "-H", "0.0.0.0", "-p", "3001"]
