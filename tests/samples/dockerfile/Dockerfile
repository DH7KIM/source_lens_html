# Dockerfile sample: build stage and runtime stage
FROM gcc:13 AS build
WORKDIR /src
COPY src/ ./src/
RUN g++ -std=c++20 -O2 -o hello src/main.cpp

FROM debian:stable-slim
ARG VERSION=1.0.0
ENV APP_NAME="hello" PORT=8080
LABEL version="$VERSION"
COPY --from=build /src/hello /usr/local/bin/hello
EXPOSE 8080
USER nobody
CMD ["hello", "--port", "8080"]
