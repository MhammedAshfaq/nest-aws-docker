import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule, InjectConnection } from '@nestjs/mongoose';
import { Connection, set } from 'mongoose';
import { User, UserSchema } from './user.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const uri = configService.get<string>('MONGODB_URI');
        console.log(`🟢 Connecting to MongoDB at: ${uri}`); // Log the URI
        return { uri };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  onModuleInit() {
    set('debug', true); // Enable Mongoose debug logging

    this.connection.on('connected', () => {
      console.log('✅ MongoDB Connected Successfully!');
    });

    this.connection.on('error', (err) => {
      console.error('❌ MongoDB Connection Error:', err);
    });

    this.connection.on('disconnected', () => {
      console.warn('⚠️ MongoDB Disconnected!');
    });
  }
}
