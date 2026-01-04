import { IsEmail, IsString } from 'class-validator';

export class SendEmailDto {
  @IsEmail()
  emailId: string;

  @IsString()
  emailSubject: string;

  @IsString()
  emailBody: string;
}
