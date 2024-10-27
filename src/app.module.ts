import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import configuration from 'config/configuration';
import { validateEnv } from 'scripts/env.validation';
import { PrismaModule } from './modules/share/prisma/prisma.module';
import { UserModule } from './modules/core/user/user.module';
import { AuthModule } from 'src/modules/apps/auth/auth.module';
import { EmailModule } from 'src/modules/share/email/email.module';
import { CategoryModule } from './modules/apps/category/category.module';
import { SubCategoryModule } from 'src/modules/apps/subcategory/subcategory.module';
import { AttributeTypeModule } from 'src/modules/apps/attributeType/attribute-type.module';
import { AttributeValueModule } from 'src/modules/apps/attributeValue/attribute-value.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
      load: [configuration],
      validate: validateEnv,
    }),
    PrismaModule,
    UserModule,
    AuthModule,
    EmailModule,
    CategoryModule,
    SubCategoryModule,
    AttributeTypeModule,
    AttributeValueModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
