import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/order.dto';
export declare class OrderController {
    private readonly orderService;
    constructor(orderService: OrderService);
    getOrder(id: number): Promise<({
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
