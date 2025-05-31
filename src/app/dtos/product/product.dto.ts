export class ProductDTO {
    name: string;
    price: number;
    description: string;
    category_id: number;
    thumbnail: string;

    constructor(data: any) {
        this.name = data.name || '';
        this.price = data.price || 0;
        this.description = data.description || '';
        this.category_id = data.category_id || 0;
        this.thumbnail = data.thumbnail || '';
    }
}
