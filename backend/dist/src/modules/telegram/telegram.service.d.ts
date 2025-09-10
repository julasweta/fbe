import { HttpService } from '@nestjs/axios';
import { OrderItemDto } from '../order-item/dto/order-item.dto';
import { UserForTelegram } from '../users/dto/base-user.dto';
import { PaymentMethod } from '@prisma/client';
export declare class TelegramService {
    private readonly http;
    private readonly chatIds;
    constructor(http: HttpService);
    sendOrderNotification(data: {
        user: UserForTelegram;
        items: OrderItemDto[] | undefined;
        paymentMethod: PaymentMethod;
    }): Promise<void>;
    sendContactMessage(data: {
        name: string;
        email: string;
        message: string;
        imageUrl?: string;
    }): Promise<void>;
    messagesFromCustomer(data: any): Promise<void>;
    private broadcastMessage;
    private broadcastPhoto;
}
