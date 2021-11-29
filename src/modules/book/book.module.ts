import { forwardRef, Module } from '@nestjs/common';
import { BookService } from './book.service';
import { BookController } from './book.controller';
import { BookRepository } from 'src/repositories/book.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, UserSchema } from 'src/models/book.model';

import { AuthorModule } from '../author/author.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: UserSchema }]),
    forwardRef(() => AuthorModule),
  ],
  providers: [BookService, BookRepository],
  exports: [BookService, BookRepository],
  controllers: [BookController],
})
export class BookModule {}
