import { Controller } from '@nestjs/common';
import { ProductTranslationsService } from './product-translations.service';

@Controller('product-translations')
export class ProductTranslationsController {
  constructor(private readonly productTranslationsService: ProductTranslationsService) {}
}
