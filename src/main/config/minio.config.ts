import { ConfigService } from "@nestjs/config";
import { MinioModuleOptions } from "@svtslv/nestjs-minio";

export const configureMinio = (
    configService: ConfigService
): MinioModuleOptions => {
    const port = +configService.get<number>("storage.minio.port") ?? 9000;
    const secure = configService.get<string>("storage.minio.ssl") === "true";
    return {
        config: {
            port: port,
            endPoint:
                configService.get<string>("storage.minio.host") ?? "localhost",
            accessKey: configService.get<string>(
                "storage.minio.credentials.access"
            ),
            secretKey: configService.get<string>(
                "storage.minio.credentials.secret"
            ),
            useSSL: secure
        }
    };
};
