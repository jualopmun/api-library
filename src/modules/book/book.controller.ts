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

import { CreateBookDto } from './dto/createBook.dto';
import { BookService } from './book.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthorService } from '../author/author.service';

@ApiTags('Book')
@Controller('book')
export class BookController {
  private readonly logger = new Logger(BookController.name);

  constructor(
    private bookService: BookService,
    private authorService: AuthorService,
  ) {}

  @ApiOperation({
    summary: 'Get book by title',
    description: 'Get book by title',
  })
  @ApiParam({
    name: 'title',
    type: 'string',
    description: 'The title of book',
    required: true,
  })
  @Get('/:title')
  async getTitle(@Res() res: any, @Req() req: any) {
    const { title } = req.params;
    this.logger.log(`Init get book with name : ${title}`);
    let books: any;
    try {
      books = await this.bookService.findByTitle(title);
      if (books.length === 0) {
        return res.status(HttpStatus.OK).send({ message: 'Book not found' });
      }
      this.logger.log(`Book get: ${books}`);
      return res.status(HttpStatus.OK).send(books);
    } catch (error) {
      this.logger.error(`Error get book: ${error}`);
      return res.status(HttpStatus.BAD_GATEWAY).send(error);
    }
  }

  @ApiOperation({
    summary: 'Create book',
    description: 'Create book',
  })
  @Post('/createBook/:idAuthor')
  @UseGuards(AuthGuard('jwt'))
  async createAuthor(
    @Body() createBookDto: CreateBookDto,
    @Res() res: any,
    @Req() req: any,
  ) {
    this.logger.log(`Init create Book with title : ${createBookDto.title}`);
    let newBook: any;
    const { id } = req.user;
    const { idAuthor } = req.params;
    try {
      const author = await this.authorService.findById(idAuthor);
      if (!author) {
        return res.status(HttpStatus.OK).send({ message: 'Author not found' });
      }

      const { createdById } = author;
      if (String(createdById) !== String(id)) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send({ message: 'Not permissions to create book in this author' });
      }
      newBook = await this.bookService.createBook(createBookDto, idAuthor);
      this.logger.log(`book: ${newBook}`);
      return res.status(HttpStatus.CREATED).send(newBook);
    } catch (error) {
      this.logger.error(`Error create book: ${error}`);
      return res.status(HttpStatus.BAD_GATEWAY).send(error);
    }
  }

  @ApiOperation({
    summary: 'Update book',
    description: 'Update book',
  })
  @Put('/updateBook/:idAuthor/:idBook')
  @UseGuards(AuthGuard('jwt'))
  async updateAuthor(
    @Body() createBookDto: CreateBookDto,
    @Res() res: any,
    @Req() req: any,
  ) {
    let author: any;
    let book: any;
    const { id } = req.user;
    const { idAuthor, idBook } = req.params;
    try {
      author = await this.authorService.findById(idAuthor);
      if (!author) {
        return res.status(HttpStatus.OK).send({ message: 'Author not found' });
      }

      const { createdById } = author;

      if (String(createdById) !== String(id)) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send({ message: 'Not permissions to update this book' });
      }
      book = await this.bookService.findById(idBook);
      if (!book) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .send({ message: 'Book not found' });
      }

      const updateBook = await this.bookService.findAndUpdate(
        idBook,
        createBookDto,
      );
      this.logger.log(`Book updated: ${updateBook}`);
      return res.status(HttpStatus.OK).send(updateBook);
    } catch (error) {
      this.logger.error(`Error update book: ${error}`);
      return res.status(HttpStatus.BAD_GATEWAY).send(error);
    }
  }

  @ApiOperation({
    summary: 'Delete book',
    description: 'Delete book',
  })
  @Delete('/deleteBook/:idAuthor/:idBook')
  @UseGuards(AuthGuard('jwt'))
  async deleteAuthor(@Res() res: any, @Req() req: any) {
    let author: any;
    let book: any;
    const { id } = req.user;
    const { idAuthor, idBook } = req.params;
    try {
      author = await this.authorService.findById(idAuthor);
      if (!author) {
        return res.status(HttpStatus.OK).send({ message: 'Author not found' });
      }

      const { createdById } = author;

      if (String(createdById) !== String(id)) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send({ message: 'Not permissions to delete this book' });
      }
      book = await this.bookService.findById(idBook);
      if (!book) {
        return res.status(HttpStatus.OK).send({ message: 'Book not found' });
      }

      await this.bookService.findAndDelete(idAuthor, idBook);
      this.logger.log(`Book deleted: ${book.id}`);
      return res
        .status(HttpStatus.OK)
        .send({ message: 'Book deleted correctly' });
    } catch (error) {
      this.logger.error(`Error in deleted book: ${error}`);
      return res.status(HttpStatus.BAD_GATEWAY).send(error);
    }
  }
}
