import { ApiProperty } from '@nestjs/swagger';
import { Status } from 'src/enums/status.enum';

export class UpdateProductDto {
  @ApiProperty({
    type: 'enum',
    enum: Status,
    default: Status.PUBLISHED,
    example: Status.PUBLISHED,
    description:
      'Status do produto a ser editado, é por padrão "published", pois com esse status o produto não é mais atualizado pela rotina diária, uma vez que o clinete assumiu a responsabilidade na atualização',
    required: true,
  })
  status?: Status;

  @ApiProperty({
    description: 'URL do produto',
    example: 'https://qualquercoisa.com.br',
    required: false,
  })
  url?: string;

  @ApiProperty({
    description: 'Criador do produto no bd',
    example: 'John',
    required: false,
  })
  creator?: string;

  @ApiProperty({
    description: 'Nome do produto no bd',
    example: 'Cação',
    required: false,
  })
  product_name?: string;

  @ApiProperty({
    description: 'Quantidade do produto no bd',
    example: '10',
    required: false,
  })
  quantity?: string;

  @ApiProperty({
    description: 'Marca do produto no bd',
    example: 'Gomes da COsta',
    required: false,
  })
  brands?: string;

  @ApiProperty({
    description: 'Categoria do produto no bd',
    example: 'Peixe',
    required: false,
  })
  categories?: string;

  @ApiProperty({
    description: 'Etiqueta do produto no bd',
    example: 'melhor do mundo',
    required: false,
  })
  labels?: string;

  @ApiProperty({
    description: 'Cidades do produto no bd',
    example: 'Tauguatinga',
    required: false,
  })
  cities?: string;

  @ApiProperty({
    description: 'Lugares para comprar do produto no bd',
    example: 'Pesqueiro',
    required: false,
  })
  purchase_places?: string;

  @ApiProperty({
    description: 'Lojas do produto no bd',
    example: 'Loja do peixe',
    required: false,
  })
  stores?: string;

  @ApiProperty({
    description: 'Texto do ingrediente do produto no bd',
    example: 'Peixe fresco',
    required: false,
  })
  ingredients_text?: string;

  @ApiProperty({
    description: 'Traços do produto no bd',
    example: 'peixe',
    required: false,
  })
  traces?: string;

  @ApiProperty({
    description: 'Tamanho para servir o produto no bd',
    example: '250g',
    required: false,
  })
  serving_size?: string;

  @ApiProperty({
    description: 'Quantidade para servir do produto no bd',
    example: 3,
    required: false,
  })
  serving_quantity?: number;

  @ApiProperty({
    description: 'Pontuação nutricional do produto no bd',
    example: 100,
    required: false,
  })
  nutriscore_score?: number;

  @ApiProperty({
    description: 'Categoria principal do produto no bd',
    example: 'pescado',
    required: false,
  })
  main_category?: string;

  @ApiProperty({
    description: 'URL da imagem do produto no bd',
    example: 'https://imagem.com.br/',
    required: false,
  })
  image_url?: string;
}
