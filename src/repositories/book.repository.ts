import { InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Book } from '../models/book.model';
import { CreateBookDto } from '../modules/book/dto/createBook.dto';

export class BookRepository {
  private readonly logger = new Logger(BookRepository.name);
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<Book>,
  ) {}

  async createBook(createBookDto: CreateBookDto, authorId: string) {
    const { title, createdAt, summary } = createBookDto;
    const newBook = new this.bookModel({
      author: authorId,
      title,
      createdAt,
      summary,
    });

    try {
      const createdBook = await newBook.save();
      return createdBook;
    } catch (error) {
      this.logger.error(`Error create Book repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findById(id: string) {
    try {
      return await this.bookModel.findById(id);
    } catch (error) {
      this.logger.error(`Error find Book by Id repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findByTitle(title: string) {
    try {
      return await this.bookModel
        .find({
          title: { $regex: '.*' + title + '.*' },
        })
        .populate('author', 'name')
        .limit(5);
    } catch (error) {
      this.logger.error(`Error find Book by title repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findAndUpdate(id: string, updateBook: CreateBookDto) {
    try {
      return await this.bookModel
        .findByIdAndUpdate(id, updateBook, { new: true })
        .exec();
    } catch (error) {
      this.logger.error(`Error updated Book repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findAndDelete(id: string) {
    try {
      return await this.bookModel.findByIdAndDelete(id);
    } catch (error) {
      this.logger.error(`Error deleted Book repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }
}
