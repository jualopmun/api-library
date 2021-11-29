import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  Logger,
  UseGuards,
  Req,
  Get,
  Delete,
  Put,
} from '@nestjs/common';

import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { CreateAuthorDto } from './dto/createAuthor.dto';
import { AuthorService } from './author.service';
import { AuthGuard } from '@nestjs/passport';
import { Workbook } from 'exceljs';

@ApiTags('Author')
@Controller('author')
export class AuthorController {
  private readonly logger = new Logger(AuthorController.name);

  constructor(private authorService: AuthorService) {}

  @ApiOperation({
    summary: 'Get author by name',
    description: 'Get author by name',
  })
  @ApiParam({
    name: 'name',
    type: 'string',
    description: 'The name of author',
    required: true,
  })
  @Get('/:name')
  async getAuthor(@Res() res: any, @Req() req: any) {
    const { name } = req.params;
    this.logger.log(`Init get author with name : ${name}`);
    let authors: any;
    try {
      authors = await this.authorService.findByName(name);
      if (authors.length === 0) {
        return res.status(HttpStatus.OK).send({ message: 'Authors not found' });
      }
      this.logger.log(`Authors get: ${authors}`);
      return res.status(HttpStatus.OK).send(authors);
    } catch (error) {
      this.logger.error(`Error get author: ${error}`);
      return res.status(HttpStatus.BAD_GATEWAY).send(error);
    }
  }

  @ApiOperation({
    summary: 'Create author',
    description: 'Create author',
  })
  @Post('/createAuthor')
  @UseGuards(AuthGuard('jwt'))
  async createAuthor(
    @Body() createAuthorDto: CreateAuthorDto,
    @Res() res: any,
    @Req() req: any,
  ) {
    this.logger.log(`Init create author with name : ${createAuthorDto.name}`);
    let newAuthor: any;
    const { id } = req.user;
    try {
      newAuthor = await this.authorService.createrAuthor(createAuthorDto, id);
      this.logger.log(`Author created: ${newAuthor}`);
      return res.status(HttpStatus.CREATED).send(newAuthor);
    } catch (error) {
      this.logger.error(`Error in create author: ${error}`);
      return res.status(HttpStatus.BAD_GATEWAY).send(error);
    }
  }

  @ApiOperation({
    summary: 'Update author',
    description: 'Update author',
  })
  @Put('/updateAuthor/:idAuthor')
  @UseGuards(AuthGuard('jwt'))
  async updateAuthor(
    @Body() createAuthorDto: CreateAuthorDto,
    @Res() res: any,
    @Req() req: any,
  ) {
    let author: any;
    const { id } = req.user;
    const { idAuthor } = req.params;
    try {
      author = await this.authorService.findById(idAuthor);
      if (!author) {
        return res.status(HttpStatus.OK).send({ message: 'Author not found' });
      }

      const { createdById } = author;

      if (String(createdById) !== String(id)) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send({ message: 'Not permissions to update this author' });
      }
      const updateAuthor = await this.authorService.findAndUpdate(
        createAuthorDto,
        idAuthor,
      );
      this.logger.log(`Author updated: ${updateAuthor}`);
      return res.status(HttpStatus.OK).send(updateAuthor);
    } catch (error) {
      this.logger.error(`Error in create author: ${error}`);
      return res.status(HttpStatus.BAD_GATEWAY).send(error);
    }
  }

  @ApiOperation({
    summary: 'Delete author',
    description: 'Delete author',
  })
  @Delete('/deleteAuthor/:idAuthor')
  @UseGuards(AuthGuard('jwt'))
  async deleteAuthor(@Res() res: any, @Req() req: any) {
    let author: any;
    const { id } = req.user;
    const { idAuthor } = req.params;
    try {
      author = await this.authorService.findById(idAuthor);
      if (!author) {
        return res.status(HttpStatus.OK).send({ message: 'Author not found' });
      }

      const { createdById } = author;

      if (String(createdById) !== String(id)) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send({ message: 'Not permissions to delete this author' });
      }
      await this.authorService.findAndDelete(idAuthor);
      this.logger.log(`Author delete: ${author.id}`);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Author deleted correctly' });
    } catch (error) {
      this.logger.error(`Error in create author: ${error}`);
      return res.status(HttpStatus.BAD_GATEWAY).send(error);
    }
  }

  @ApiOperation({
    summary: 'Export authors from DB',
    description: 'Export authors from DB',
  })
  @Get('/export/csv')
  async exportCSV(@Res() res: any) {
    this.logger.log(`Init export authors CSV`);
    let authors: any;
    try {
      authors = await this.authorService.findAll();
      if (authors.length === 0) {
        return res.status(HttpStatus.OK).send({ message: 'Authors not found' });
      }
      this.logger.log(`Authors get: ${authors}`);

      const workbook = new Workbook();
      const worksheet = workbook.addWorksheet('Authors');

      worksheet.columns = [
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Bibliography', key: 'bibliography', width: 25 },
        { header: 'Books', key: 'books', width: 10 },
      ];
      worksheet.addRows(authors);

      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader(
        'Content-Disposition',
        'attachment; filename=' + 'authors.xlsx',
      );

      this.logger.log(`Authors get exports: ${authors}`);
      return workbook.xlsx.write(res).then(function () {
        res.status(200).end();
      });
    } catch (error) {
      this.logger.error(`Error export authors: ${error}`);
      return res.status(HttpStatus.BAD_GATEWAY).send(error);
    }
  }
}
