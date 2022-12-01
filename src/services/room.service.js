const httpStatus = require('http-status');
const { Room } = require('../models');
const ApiError = require('../utils/ApiError');

const createRoom = async (roomBody) => {
  return Room.create(roomBody);
};

const queryRooms = async (filter, options) => {
  const rooms = await Room.paginate(filter, options);
  return rooms;
};

const getRoomById = async (id) => {
  return Room.findById(id);
};

const getRoomByIdUserPopulated = async (id) => {
  return Room.findById(id).populate('users').populate('primeUser');
};

const updateRoomById = async (roomId, updateBody) => {
  return await Room.findByIdAndUpdate(roomId, updateBody, { new: true });
};

const deleteRoomById = async (roomId) => {
  const room = await getRoomById(roomId);
  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Room not found');
  }
  await room.remove();
  return room;
};

module.exports = {
  createRoom,
  queryRooms,
  getRoomById,
  updateRoomById,
  deleteRoomById,
  getRoomByIdUserPopulated,
};
