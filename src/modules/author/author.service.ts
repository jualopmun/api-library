import { Injectable } from '@nestjs/common';
import { BookRepository } from '../../repositories/book.repository';

import { AuthorRepository } from './../../repositories/author.repository';
import { CreateAuthorDto } from './dto/createAuthor.dto';

@Injectable()
export class AuthorService {
  constructor(
    private readonly authorRepository: AuthorRepository,
    public readonly bookRepository: BookRepository,
  ) {}

  async createrAuthor(createAuthorDto: CreateAuthorDto, userId: string) {
    const createdAuthor = await this.authorRepository.createAuthor(
      createAuthorDto,
      userId,
    );
    return createdAuthor;
  }

  async findByName(name: string) {
    const author = await this.authorRepository.findByName(name);
    return author;
  }

  async findAndUpdate(createAuthorDto: CreateAuthorDto, id: string) {
    return await this.authorRepository.findAndUpdate(id, createAuthorDto);
  }

  async findById(id: string) {
    return await this.authorRepository.findById(id);
  }

  async findAndDelete(id: string) {
    const author = await this.findById(id);
    author.books.forEach((book) => this.bookRepository.findAndDelete(book.id));
    return await this.authorRepository.findAndDelete(id);
  }

  async findAndDeleteBook(idAuthor: string, idBook: string) {
    return await this.authorRepository.findAndDeleteBook(idAuthor, idBook);
  }

  async findAll() {
    return await this.authorRepository.findAll();
  }
}
