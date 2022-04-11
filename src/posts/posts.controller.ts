import {
  Body,
  Controller,
  HttpStatus,
  Post,
  UseGuards,
  Request,
  Param,
  Patch,
  Delete,
  Get,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { PostsService } from './posts.service';
import { PostCreateDto } from './dto/post.create.dto';
import { PostCreateResponseDto } from './dto/post.create.response.dto';
import { JwtAccessValidateGuard } from '../guards/jwt-access-validate.guard';
import { PostPatchDto } from './dto/post.patch.query.dto';
import { PostPatchResponseDto } from './dto/post.patch.response.dto';
import { PostDeleteResponseDto } from './dto/post.delete.response.dto';
import { PostGetAllResponseDto } from './dto/post.get-all.response.dto';
import { PostGetUserResponseDto } from './dto/post.get-all-user.response.dto';

@ApiTags('Posts')
@Controller('post')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @ApiBearerAuth()
  @Post('/')
  @UseGuards(JwtAccessValidateGuard)
  @ApiOperation({ summary: 'Add a new post' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'New post was created',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: Error,
    description: 'Bad request',
  })
  add(
    @Body() body: PostCreateDto,
    @Request() req,
  ): Promise<PostCreateResponseDto> {
    return this.postsService.add(body, req.user.id);
  }

  @ApiBearerAuth()
  @Patch('/:id')
  @UseGuards(JwtAccessValidateGuard)
  @ApiOperation({ summary: 'Update post entity' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Post entity updated in database',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: Error,
    description: 'Bad request',
  })
  patch(
    @Param('id') id: string,
    @Body() body: PostPatchDto,
    @Request() req,
  ): Promise<PostPatchResponseDto> {
    return this.postsService.patch(id, body, req.user.id);
  }

  @ApiBearerAuth()
  @Delete('/:id')
  @UseGuards(JwtAccessValidateGuard)
  @ApiOperation({ summary: 'Delete post entity' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Post entity deleted from database',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: Error,
    description: 'Bad request',
  })
  delete(
    @Param('id') id: string,
    @Request() req,
  ): Promise<PostDeleteResponseDto[]> {
    return this.postsService.delete(id, req.user.id);
  }

  @ApiBearerAuth()
  @Get('/')
  @UseGuards(JwtAccessValidateGuard)
  @ApiOperation({ summary: 'Get all posts' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Parser entity updated in database',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: Error,
    description: 'Bad request',
  })
  getAllPosts(): Promise<PostGetAllResponseDto[]> {
    return this.postsService.getAllPosts();
  }

  @ApiBearerAuth()
  @Get('/:userid')
  @UseGuards(JwtAccessValidateGuard)
  @ApiOperation({ summary: 'Get all posts' })
  @ApiOkResponse({
    status: HttpStatus.OK,
    description: 'Parser entity updated in database',
  })
  @ApiBadRequestResponse({
    status: HttpStatus.BAD_REQUEST,
    type: Error,
    description: 'Bad request',
  })
  getUserPosts(
    @Param('userid') userid: string,
    @Request() req,
  ): Promise<PostGetUserResponseDto[]> {
    return this.postsService.getUserPosts(userid, req.user.id);
  }
}
