import { io } from 'socket.io-client';
import utils from './utils';

export const socket = io(utils.getBackEnd());
