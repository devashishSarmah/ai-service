import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class SshAuthGuard implements CanActivate {
  private authorizedKeys: string[];

  constructor() {
    this.loadAuthorizedKeys();
  }

  // Load authorized keys from file
  private loadAuthorizedKeys() {
    const filePath = path.resolve(__dirname, '/home/dev/.ssh/authorized_keys');
    this.authorizedKeys = fs
      .readFileSync(filePath, 'utf8')
      .split('\n')
      .filter((key) => key.trim() !== '');
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();
    const sshKey = request.headers['x-ssh-key'] as string;

    if (!sshKey || !this.isAuthorizedKey(sshKey)) {
      throw new UnauthorizedException('Unauthorized access');
    }
    return true;
  }

  private isAuthorizedKey(sshKey: string): boolean {
    return this.authorizedKeys.includes(sshKey);
  }
}
