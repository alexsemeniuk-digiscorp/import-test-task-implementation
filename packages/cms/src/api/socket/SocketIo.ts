import { Server, Socket } from 'socket.io';

export class SocketIo {
  public static io: Server;

  public static init(): void {
    if (this.io) {
      return;
    }

    this.io = new Server(strapi.server.httpServer, {
      cors: {
        origin: [process.env.FRONTEND_URL],
        methods: ['GET', 'POST'],
      },
    });

    this.io.use((socket, next) => {
      const { userId } = socket.handshake.auth;

      if (!userId) {
        return next(new Error('Invalid user'));
      }

      this.joinUserRoom(socket, userId);

      next();
    });

    this.io.on('connection', (socket) => {
      const { userId } = socket.handshake.auth;

      this.emitToUser(
        userId,
        'user-connected',
        `Connected to user with id: ${userId}`,
      );
    });
  }

  public static getUserRoomName(userId: number): string {
    return `user-${userId}`;
  }

  public static emitToUser(userId: number, event: string, data: unknown): void {
    this.io.to(this.getUserRoomName(userId)).emit(event, data);
  }

  private static joinUserRoom(socket: Socket, userId: number): void {
    if (!userId) {
      return;
    }

    const roomName = this.getUserRoomName(userId);

    socket.join(roomName);
  }
}
