import { PrismaService } from '../../../prisma/prisma.service';
import { CreateOrderDto } from './dto/order.dto';
import { TelegramService } from '../telegram/telegram.service';
export declare class OrderService {
    private prisma;
    private telegramService;
    constructor(prisma: PrismaService, telegramService: TelegramService);
    getOrderById(id: number): Promise<({
        items: {
            id: number;
            size: string | null;
            name: string;
            productId: number | null;
            color: string | null;
            price: number;
            priceSale: number | null;
            image: string | null;
            quantity: number;
            finalPrice: number;
            orderId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        guestName: string | null;
        guestPhone: string | null;
        guestEmail: string | null;
        guestAddress: string | null;
        novaPostCity: string | null;
        novaPostBranch: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        status: import("@prisma/client").$Enums.OrderStatus;
    }) | null>;
    createOrder(dto: CreateOrderDto): Promise<{
        items: {
            id: number;
            size: string | null;
            name: string;
            productId: number | null;
            color: string | null;
            price: number;
            priceSale: number | null;
            image: string | null;
            quantity: number;
            finalPrice: number;
            orderId: number;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number | null;
        guestName: string | null;
        guestPhone: string | null;
        guestEmail: string | null;
        guestAddress: string | null;
        novaPostCity: string | null;
        novaPostBranch: string | null;
        paymentMethod: import("@prisma/client").$Enums.PaymentMethod;
        status: import("@prisma/client").$Enums.OrderStatus;
    }>;
}
