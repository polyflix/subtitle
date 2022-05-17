import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class GoogleCloudStoragePersistence {
    constructor(private readonly configService: ConfigService) {}
}
