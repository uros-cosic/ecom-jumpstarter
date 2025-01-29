export class OrderService {
    static readonly Events = {
        CREATED: 'order.created',
        COMPLETED: 'order.completed',
        FULFILLED: 'order.fulfilled',
    }
}
