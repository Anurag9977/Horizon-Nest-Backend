// import { DynamicModule, Module } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
// import { ConfigModule } from '../config';

// @Module({
//   imports: [
//     MongooseModule.forRootAsync({
//       imports: [ConfigModule],
//       useFactory: (configService: ConfigService) => ({
//         uri: configService.get('MONGO_URI'),
//       }),
//       inject: [ConfigService],
//     }),
//   ],
// })
// export class DatabaseModule {
//   static forFeature(models: ModelDefinition[]): DynamicModule {
//     return MongooseModule.forFeature(models);
//   }
// }
