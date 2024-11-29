import { Injectable } from '@angular/core';
import * as AWS from 'aws-sdk';

@Injectable({
  providedIn: 'root'
})
export class S3Service {
  private s3: AWS.S3;

  constructor() {
    // Cấu hình AWS SDK
    AWS.config.update({
      accessKeyId: 'AKIAU6GDWCU4MGFBKJDU',
      secretAccessKey: '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',
      region: 'ap-southeast-1'
    });

    this.s3 = new AWS.S3();
  }

  uploadFile(file: File): Promise<string> {
    const params = {
      Bucket: 'audio-files-quizz-web',
      Key: `audio/${file.name}`, // Đường dẫn lưu file trên S3
      Body: file,
      ContentType: file.type
    };

    return new Promise((resolve, reject) => {
      this.s3.upload(params, (err: any, data: { Location: string | PromiseLike<string>; }) => {
        if (err) {
          reject(err);
        } else {
          resolve(data.Location); // Trả về đường dẫn của file đã tải lên
        }
      });
    });
  }
}