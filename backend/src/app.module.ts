import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MongooseModule } from '@nestjs/mongoose';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { TracksModule } from './tracks/tracks.module';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
@Module({
  imports: [
    MulterModule.register({
      dest: './files',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
    }),
    MongooseModule.forRoot(
      `mongodb+srv://dbuser:dbuser@cluster0.caszp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
    ),
    TracksModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
