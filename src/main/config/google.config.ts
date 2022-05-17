import { StorageOptions } from "@google-cloud/storage/build/src/storage";
import { ConfigService } from "@nestjs/config";

export const gcloudConfig = (cfg: ConfigService): StorageOptions => {
    const buff = new Buffer(cfg.get("storage.google.project.key"), "base64");
    const decoded = buff.toString("ascii");
    return {
        projectId: cfg.get("storage.google.project.id"),
        credentials: {
            client_email: cfg.get("storage.google.client.email"),
            private_key: decoded
        }
    };
};
