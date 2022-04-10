import { ApiProperty, PickType } from '@nestjs/swagger';
import { PostCreateDto } from './post.create.dto';
import { StatusType } from './status.dto';
import { IsEnum } from 'class-validator';

export class PostPatchDto extends PickType(PostCreateDto, [
  'header',
  'body',
] as const) {
  @ApiProperty({
    enum: StatusType,
    enumName: 'StatusTypes',
    example: [StatusType.Visible, StatusType.Invisible],
    type: String,
  })
  @IsEnum(StatusType)
  postStatus: string;
}
