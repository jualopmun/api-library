import { Injectable } from '@nestjs/common';

import { BookRepository } from './../../repositories/book.repository';
import { CreateBookDto } from './dto/createBook.dto';
import { AuthorService } from '../author/author.service';

@Injectable()
export class BookService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly authorService: AuthorService,
  ) {}

  async createBook(createBookDto: CreateBookDto, authorId: string) {
    const createdBook = await this.bookRepository.createBook(
      createBookDto,
      authorId,
    );
    const author = await this.authorService.findById(authorId);
    author.books.push(createdBook.id);
    await this.authorService.findAndUpdate(author, authorId);
    return createdBook;
  }

  async findByTitle(title: string) {
    const book = await this.bookRepository.findByTitle(title);
    return book;
  }

  async findAndUpdate(id: string, createBookDto: CreateBookDto) {
    return await this.bookRepository.findAndUpdate(id, createBookDto);
  }

  async findById(id: string) {
    return await this.bookRepository.findById(id);
  }

  async findAndDelete(idAuthor: string, idBook: string) {
    this.authorService.findAndDeleteBook(idAuthor, idBook);
    return await this.bookRepository.findAndDelete(idBook);
  }
}
