import { InternalServerErrorException, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Author } from '../models/author.model';
import { CreateAuthorDto } from '../modules/author/dto/createAuthor.dto';

export class AuthorRepository {
  private readonly logger = new Logger(AuthorRepository.name);
  constructor(
    @InjectModel(Author.name) private readonly authorModel: Model<Author>,
  ) {}

  async createAuthor(createAuthorDto: CreateAuthorDto, userId: string) {
    const { name, bibliography } = createAuthorDto;
    const newAuthor = new this.authorModel({
      createdById: userId,
      name,
      bibliography,
    });

    try {
      const createdAuthor = await newAuthor.save();
      return createdAuthor;
    } catch (error) {
      this.logger.error(`Error create Author repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findById(id: string) {
    try {
      return await this.authorModel
        .findById(id)
        .populate({ path: 'books', select: 'id' });
    } catch (error) {
      this.logger.error(`Error search Author by id repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findByName(name: string) {
    try {
      return await this.authorModel
        .find({
          name: { $regex: '.*' + name + '.*' },
        })
        .populate({ path: 'books', select: 'title' })
        .limit(5)
        .exec();
    } catch (error) {
      this.logger.error(`Error search Author by name repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findAndUpdate(id: string, updateAuthor: CreateAuthorDto) {
    try {
      return await this.authorModel
        .findByIdAndUpdate(id, updateAuthor, { new: true })
        .exec();
    } catch (error) {
      this.logger.error(`Error update Author repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findAndDelete(id: string) {
    try {
      return await this.authorModel.findByIdAndDelete(id);
    } catch (error) {
      this.logger.error(`Error deleted Author repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findAndDeleteBook(idAuthor: string, idBook: string) {
    try {
      return await this.authorModel
        .findByIdAndUpdate(idAuthor, {
          $pullAll: { books: [idBook] },
        })
        .exec();
    } catch (error) {
      this.logger.error(`Error deleted book in author repository: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async findAll() {
    try {
      return await this.authorModel
        .find()
        .populate({ path: 'books', select: 'title' });
    } catch (error) {
      this.logger.error(`Error find all Authors: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }
}
