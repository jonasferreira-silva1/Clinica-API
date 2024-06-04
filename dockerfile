FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY target/clinica-api-0.0.1.jar deploy-clinca-api-0.0.1.jar
EXPOSE 8080
CMD ["java", "-jar", "deploy-clinca-api-1.0.0.jar"]